'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

export type ForumCategory = 'general' | 'html' | 'css' | 'javascript' | 'python' | 'career';

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  category: ForumCategory;
  title: string;
  body: string;
  isSolved: boolean;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  body: string;
  createdAt: string;
}

interface ForumState {
  posts: ForumPost[];
  replies: ForumReply[];
  activePostId: string | null;
  loadingPosts: boolean;
  loadingReplies: boolean;
  saving: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  selectPost: (postId: string | null) => Promise<void>;
  createPost: (input: Pick<ForumPost, 'category' | 'title' | 'body'>, authorId: string) => Promise<void>;
  createReply: (postId: string, body: string, authorId: string) => Promise<void>;
  setSolved: (postId: string, isSolved: boolean) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  deleteReply: (replyId: string) => Promise<void>;
}

interface ForumPostRow {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  category: ForumCategory;
  title: string;
  body: string;
  is_solved: boolean;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

interface ForumReplyRow {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  body: string;
  created_at: string;
}

let forumChannel: ReturnType<ReturnType<typeof getSupabase>['channel']> | null = null;
let postsRequestVersion = 0;
let repliesRequestVersion = 0;

function mapPost(row: ForumPostRow): ForumPost {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    category: row.category,
    title: row.title,
    body: row.body,
    isSolved: row.is_solved,
    replyCount: row.reply_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReply(row: ForumReplyRow): ForumReply {
  return {
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    body: row.body,
    createdAt: row.created_at,
  };
}

function sortPosts(posts: ForumPost[]) {
  return [...posts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export const useForumStore = create<ForumState>((set, get) => ({
  posts: [],
  replies: [],
  activePostId: null,
  loadingPosts: false,
  loadingReplies: false,
  saving: false,
  error: null,

  initialize: async () => {
    if (forumChannel) return;
    const requestId = ++postsRequestVersion;
    set({ loadingPosts: true, error: null });
    const supabase = getSupabase();
    forumChannel = supabase
      .channel('community-forum')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, payload => {
        set(state => {
          if (payload.eventType === 'DELETE') {
            const removedId = String(payload.old.id);
            return {
              posts: state.posts.filter(post => post.id !== removedId),
              replies: state.replies.filter(reply => reply.postId !== removedId),
              activePostId: state.activePostId === removedId ? null : state.activePostId,
            };
          }
          const post = mapPost(payload.new as ForumPostRow);
          return { posts: sortPosts([post, ...state.posts.filter(item => item.id !== post.id)]) };
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_replies' }, payload => {
        const oldReply = payload.old as { id?: string; post_id?: string };
        const reply = payload.eventType === 'DELETE' ? null : mapReply(payload.new as ForumReplyRow);
        const replyId = reply?.id || String(oldReply.id || '');
        set(state => ({
          replies: reply
            ? [reply, ...state.replies.filter(item => item.id !== reply.id)]
            : state.replies.filter(item => item.id !== replyId),
        }));
        const postId = reply?.postId || oldReply.post_id;
        if (postId) void refreshPost(postId);
      })
      .subscribe();

    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('id,author_id,author_name,author_avatar,category,title,body,is_solved,reply_count,created_at,updated_at')
        .order('updated_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      if (requestId !== postsRequestVersion) return;
      const livePosts = get().posts;
      const postsById = new Map((data || []).map(row => {
        const post = mapPost(row as ForumPostRow);
        return [post.id, post];
      }));
      livePosts.forEach(post => postsById.set(post.id, post));
      set({ posts: sortPosts([...postsById.values()]), loadingPosts: false });
    } catch (error) {
      if (requestId !== postsRequestVersion) return;
      const details = error as { code?: string; message?: string };
      const message = details.code === 'PGRST205' || details.message?.includes("Could not find the table 'public.forum_posts'")
        ? 'FORUM_MIGRATION_REQUIRED'
        : error instanceof Error ? error.message : 'Forum mavzularini yuklab bölmadi.';
      console.error('Forum mavzularini yuklab bölmadi.', error);
      if (forumChannel) void getSupabase().removeChannel(forumChannel);
      forumChannel = null;
      set({ loadingPosts: false, error: message });
    }
  },

  selectPost: async postId => {
    const requestId = ++repliesRequestVersion;
    set({ activePostId: postId, replies: [], loadingReplies: Boolean(postId), error: null });
    if (!postId) return;
    try {
      const { data, error } = await getSupabase()
        .from('forum_replies')
        .select('id,post_id,author_id,author_name,author_avatar,body,created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
        .limit(200);
      if (error) throw error;
      if (requestId !== repliesRequestVersion) return;
      const loaded = (data || []).map(row => mapReply(row as ForumReplyRow));
      const liveReplies = get().replies.filter(reply => reply.postId === postId);
      const repliesById = new Map(loaded.map(reply => [reply.id, reply]));
      liveReplies.forEach(reply => repliesById.set(reply.id, reply));
      set({ replies: [...repliesById.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt)), loadingReplies: false });
    } catch (error) {
      if (requestId !== repliesRequestVersion) return;
      const message = error instanceof Error ? error.message : 'Forum javoblarini yuklab bölmadi.';
      console.error('Forum javoblarini yuklab bölmadi.', error);
      set({ loadingReplies: false, error: message });
    }
  },

  createPost: async (input, authorId) => {
    set({ saving: true, error: null });
    try {
      const { data, error } = await getSupabase()
        .from('forum_posts')
        .insert({ author_id: authorId, category: input.category, title: input.title.trim(), body: input.body.trim() })
        .select('id,author_id,author_name,author_avatar,category,title,body,is_solved,reply_count,created_at,updated_at')
        .single();
      if (error) throw error;
      const post = mapPost(data as ForumPostRow);
      set(state => ({ posts: sortPosts([post, ...state.posts.filter(item => item.id !== post.id)]), activePostId: post.id }));
    } catch (error) {
      console.error('Forum mavzusi yaratilmasdi.', error);
      throw error;
    } finally {
      set({ saving: false });
    }
  },

  createReply: async (postId, body, authorId) => {
    set({ saving: true, error: null });
    try {
      const { data, error } = await getSupabase()
        .from('forum_replies')
        .insert({ post_id: postId, author_id: authorId, body: body.trim() })
        .select('id,post_id,author_id,author_name,author_avatar,body,created_at')
        .single();
      if (error) throw error;
      const reply = mapReply(data as ForumReplyRow);
      set(state => ({
        replies: [...state.replies.filter(item => item.id !== reply.id), reply].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      }));
      await refreshPost(postId);
    } catch (error) {
      console.error('Forum javobi yuborilmadi.', error);
      throw error;
    } finally {
      set({ saving: false });
    }
  },

  setSolved: async (postId, isSolved) => {
    const { data, error } = await getSupabase()
      .from('forum_posts')
      .update({ is_solved: isSolved })
      .eq('id', postId)
      .select('id,author_id,author_name,author_avatar,category,title,body,is_solved,reply_count,created_at,updated_at')
      .single();
    if (error) throw error;
    const post = mapPost(data as ForumPostRow);
    set(state => ({ posts: sortPosts(state.posts.map(item => item.id === post.id ? post : item)) }));
  },

  deletePost: async postId => {
    const { error } = await getSupabase().from('forum_posts').delete().eq('id', postId);
    if (error) throw error;
    set(state => ({
      posts: state.posts.filter(post => post.id !== postId),
      replies: state.replies.filter(reply => reply.postId !== postId),
      activePostId: state.activePostId === postId ? null : state.activePostId,
    }));
  },

  deleteReply: async replyId => {
    const reply = get().replies.find(item => item.id === replyId);
    const { error } = await getSupabase().from('forum_replies').delete().eq('id', replyId);
    if (error) throw error;
    set(state => ({ replies: state.replies.filter(item => item.id !== replyId) }));
    if (reply) await refreshPost(reply.postId);
  },
}));

async function refreshPost(postId: string) {
  const { data, error } = await getSupabase()
    .from('forum_posts')
    .select('id,author_id,author_name,author_avatar,category,title,body,is_solved,reply_count,created_at,updated_at')
    .eq('id', postId)
    .maybeSingle();
  if (error) {
    console.error('Forum mavzusi yangilanmadi.', error);
    return;
  }
  if (!data) return;
  const post = mapPost(data as ForumPostRow);
  useForumStore.setState(state => ({
    posts: sortPosts([post, ...state.posts.filter(item => item.id !== post.id)]),
  }));
}
