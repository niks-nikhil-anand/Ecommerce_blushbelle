"use client";
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import BlogCard from '@/components/frontend/shared/BlogCard';

export default function BlogPostPage() {
  const [idFromURL, setIdFromURL] = useState('');
  const [data, setData] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlPath = window.location.pathname;
        const id = urlPath.split('/')[2];
        setIdFromURL(id);

        const response = await fetch(`/api/admin/dashboard/blog/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
        setData(result);

        const allBlogsResponse = await fetch('/api/admin/dashboard/blog');
        if (!allBlogsResponse.ok) {
          throw new Error('Failed to fetch related blogs');
        }
        const allBlogs = await allBlogsResponse.json();
        const filtered = allBlogs.filter(blog => blog.id !== id);
        setRelatedBlogs(filtered);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler for blog card clicks
  const handleCardClick = (blogId) => {
    window.location.href = `/blog/${blogId}`;
  };

  // Handler for read more clicks
  const handleReadMoreClick = (e, blogId) => {
    e.stopPropagation(); // Prevent card click event
    window.location.href = `/blog/${blogId}`;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-200 p-6 md:p-8 lg:p-12">
        <div className="max-w-full mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4 bg-gray-100" />
          <Skeleton className="h-64 w-full bg-gray-100" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-gray-100" />
            <Skeleton className="h-4 w-5/6 bg-gray-100" />
            <Skeleton className="h-4 w-4/6 bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-200 text-black p-6 md:p-8 lg:p-12">
        <div className="max-w-full mx-auto">
          <Alert variant="destructive" className="border-red-400 bg-gray-200 backdrop-blur text-black">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-red-200">Error</AlertTitle>
            <AlertDescription>
              Unable to load blog post. {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const formattedDate = data?.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown date';

  const readingTime = '5 min read';

  return (
   <div className="min-h-screen bg-white text-black px-4 md:px-8 lg:px-12 py-8">
  <div className="max-w-5xl mx-auto">
        {/* LIGHT MODE CARD ONLY */}
        <Card className="border bg-white dark:bg-white text-black overflow-hidden">          
          <CardHeader className="px-4 md:px-8 pt-8 pb-2">
            <div className="flex flex-wrap gap-2 mb-4">
              {data?.categories?.map((category, index) => (
                <Badge key={index} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  {category}
                  </Badge>
              )) || <Badge className="bg-emerald-600 text-white">Blog</Badge>}
            </div>
            
            <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {data?.title}
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-emerald-800">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{data?.author || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{readingTime}</span>
              </div>
            </div>
          </CardHeader>

          {data?.featuredImage && (
            <div className="relative w-full h-64 md:h-80 lg:h-96 mt-4 mb-6 overflow-hidden">
              <img 
                src={data.featuredImage} 
                alt={data.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}
          
          <CardContent className="px-4 md:px-8 pb-8">
            {data?.subtitle && (
              <div 
                className="text-xl md:text-2xl text-gray-700 mb-8 font-light leading-relaxed pl-6 border-l-4 border-emerald-500 bg-emerald-50/50 py-4 rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: data.subtitle }}
              />
            )}
            
            <ScrollArea className="pr-4">
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-emerald-600 hover:prose-a:text-emerald-800 prose-a:no-underline hover:prose-a:underline prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:mt-8 prose-h3:mb-4">
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* RELATED BLOGS USING BLOGCARD COMPONENT */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Related Articles</h2>
          <Separator className="bg-emerald-600 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.length > 0 ? (
              relatedBlogs.slice(0, 3).map((blog, index) => (
                <BlogCard
                  key={blog.id || blog._id}
                  article={{
                    _id: blog.id || blog._id,
                    title: blog.title,
                    content: blog.content || blog.subtitle,
                    featuredImage: blog.featuredImage,
                    createdAt: blog.createdAt || blog.publishedAt,
                    categories: blog.categories
                  }}
                  index={index}
                  onCardClick={handleCardClick}
                  onReadMoreClick={handleReadMoreClick}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12">
                No related articles found
              </div>
            )}
          </div>
          
          {relatedBlogs.length > 3 && (
            <div className="flex justify-center mt-8">
              <a 
                href="/blog" 
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center transition-colors"
              >
                View All Articles <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}