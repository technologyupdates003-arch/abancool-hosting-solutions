import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, Tag, TrendingUp, Globe } from "lucide-react";
import { newsService, NewsArticle } from "@/services/newsService";
import { useToast } from "@/hooks/use-toast";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchTerm, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allArticles, articleCategories, featured] = await Promise.all([
        newsService.getArticles(),
        newsService.getCategories(),
        newsService.getArticles({ featured: true, limit: 2 })
      ]);
      
      setArticles(allArticles);
      setCategories(['all', ...articleCategories]);
      setFeaturedArticles(featured);
    } catch (error) {
      console.error('Error loading news data:', error);
      toast({
        title: "Error",
        description: "Failed to load news articles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = async () => {
    try {
      if (searchTerm) {
        const searchResults = await newsService.searchArticles(searchTerm);
        setArticles(searchResults);
      } else {
        const filteredArticles = await newsService.getArticles({
          category: selectedCategory === 'all' ? undefined : selectedCategory
        });
        setArticles(filteredArticles);
      }
    } catch (error) {
      console.error('Error filtering articles:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">News & Updates</h1>
            <p className="text-lg text-muted-foreground">Stay up to date with the latest from ABANCOOL Technology</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && selectedCategory === "all" && !searchTerm && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Featured Stories
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredArticles.slice(0, 2).map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Globe className="w-16 h-16 text-primary/40" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getReadTime(article.content)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.published_at)}
                        </span>
                        <Button variant="link" size="sm" className="p-0">
                          Read More →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Articles List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {searchTerm ? `Search Results (${articles.length})` : 
                 selectedCategory === "all" ? "Latest Articles" : selectedCategory}
              </h2>
              
              <div className="space-y-6">
                {articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getReadTime(article.content)}
                        </span>
                        {article.featured && (
                          <Badge className="bg-orange-100 text-orange-800">Featured</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary cursor-pointer">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.published_at)}
                        </span>
                        <Button variant="link" size="sm" className="p-0">
                          Read Full Article →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {articles.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.slice(1).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="flex items-center justify-between w-full p-2 text-left hover:bg-muted rounded-lg transition-colors"
                      >
                        <span className="text-sm">{category}</span>
                        <span className="text-xs text-muted-foreground">
                          {articles.filter(a => a.category === category).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["php", "security", "datacenter", "infrastructure", "updates", "performance"].map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subscribe to our newsletter to get the latest news and updates delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Your email address" type="email" />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default News;