import { supabase } from "@/integrations/supabase/client";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export const newsService = {
  async getArticles(options?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('news_articles')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (options?.category && options.category !== 'all') {
      query = query.eq('category', options.category);
    }

    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news articles:', error);
      throw error;
    }

    return data as NewsArticle[];
  },

  async getArticleBySlug(slug: string) {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching news article:', error);
      throw error;
    }

    return data as NewsArticle;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('news_articles')
      .select('category')
      .eq('published', true);

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    const categories = [...new Set(data.map(article => article.category))];
    return categories;
  },

  async searchArticles(searchTerm: string) {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error searching articles:', error);
      throw error;
    }

    return data as NewsArticle[];
  }
};