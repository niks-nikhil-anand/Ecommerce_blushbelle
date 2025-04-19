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

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-emerald-800 p-6 md:p-8 lg:p-12">
        <div className="max-w-full mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4 bg-emerald-700" />
          <Skeleton className="h-64 w-full bg-emerald-700" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-emerald-700" />
            <Skeleton className="h-4 w-5/6 bg-emerald-700" />
            <Skeleton className="h-4 w-4/6 bg-emerald-700" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-emerald-800 text-white p-6 md:p-8 lg:p-12">
        <div className="max-w-full mx-auto">
          <Alert variant="destructive" className="border-red-400 bg-emerald-900/90 backdrop-blur text-white">
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

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="w-full min-h-screen text-white p-4 md:p-8 lg:p-12">
      <div className="max-w-full mx-auto">
        {/* LIGHT MODE CARD ONLY */}
        <Card className="border bg-white dark:bg-white text-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300"></div>
          
          <CardHeader className="px-4 md:px-8 pt-8 pb-2">
            <div className="flex flex-wrap gap-2 mb-4">
              {data?.categories?.map((category, index) => (
                <Badge key={index} className="bg-emerald-600 hover:bg-emerald-500 text-white">{category}</Badge>
              )) || <Badge className="bg-emerald-600 text-white">Blog</Badge>}
            </div>
            
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
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
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent"></div>
            </div>
          )}
          
          <CardContent className="px-4 md:px-8 pb-8">
            {data?.subtitle && (
              <div 
                className="text-lg md:text-xl text-emerald-900 mb-6 italic border-l-4 border-emerald-300 pl-4"
                dangerouslySetInnerHTML={{ __html: data.subtitle }}
              />
            )}
            
            <ScrollArea className="pr-4">
              <div 
                className="prose prose-sm md:prose-lg max-w-none prose-headings:text-emerald-900 prose-a:text-emerald-700 hover:prose-a:text-emerald-900"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </ScrollArea>
            
            <div className="mt-8 pt-6 border-t border-emerald-200">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {data?.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-emerald-400 text-emerald-600">#{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RELATED BLOGS */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
          <Separator className="bg-emerald-600 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.length > 0 ? (
              relatedBlogs.slice(0, 3).map((blog) => (
                <Card key={blog.id} className="overflow-hidden border shadow-md hover:shadow-lg transition-shadow duration-300  backdrop-blur text-white">
                  {blog.featuredImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={blog.featuredImage} 
                        alt={blog.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {blog.categories?.[0] && (
                          <Badge className="bg-emerald-500/80 text-white">{blog.categories[0]}</Badge>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent"></div>
                    </div>
                  )}
                  
                  <CardContent className="pt-6">
                    <CardTitle className="text-lg font-medium text-black mb-2 line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    
                    {blog.subtitle && (
                      <CardDescription className="text-gray-700 line-clamp-2 mb-4">
                        {truncateText(blog.subtitle.replace(/<[^>]*>/g, ''), 100)}
                      </CardDescription>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <div className="flex justify-between items-center w-full text-sm">
                      <span className="text-black">
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Unknown date'}
                      </span>
                      <a href={`/blog/${blog.id}`} className="flex items-center text-black hover:text-white transition-colors">
                        Read More <ArrowRight size={16} className="ml-1" />
                      </a>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-emerald-200 py-12">
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
