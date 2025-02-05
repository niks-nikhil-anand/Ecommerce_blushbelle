import Loader from '@/components/loader/loader';
import { useRouter } from 'next/navigation';
import React, { useEffect , useState } from 'react'

const RelatedBlogs = () => {

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
  
    useEffect(() => {
      const fetchArticles = async () => {
        try {
            const urlPath = window.location.pathname;
            const productId = urlPath.substring(urlPath.lastIndexOf('/') + 1);
            console.log("fetching review...........");
          const response = await axios.get(`/api/admin/dashboard/blog/${productId}`);
          setArticles(response.data);
        } catch (error) {
          console.error('Error fetching articles:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchArticles();
    }, []);
  
    const handleCardClick = (id) => {
      router.push(`/blog/${id}`);
    };
  return (
    <div className="flex flex-col px-4 md:px-10 mt-10 mb-10 justify-center md:ml-[90px]">
    <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4 font-bold text-center">
      Learn why it&apos;s good for you.
    </h2>

    {loading ? (
      <Loader />  
    ) : (
      <div>
        <div className="flex flex-wrap justify-start gap-4">
          {currentArticles.map((article) => (
            <motion.div
              key={article._id}
              className="p-4 cursor-pointer w-full sm:w-[48%] md:w-[30%] lg:w-[30%] mt-5 shadow-sm"
              onClick={() => handleCardClick(article._id)}
            >
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-44 object-cover rounded-t-lg mb-3"
              />
              <h3 className="text-base md:text-xl lg:text-base font-semibold text-center textColor hover:underline">
                {article.title}
              </h3>
              <div className='mt-5 w-25%'>
                <p className="text-sm md:text-base lg:text-sm text-gray-600 ">
                  {article.subtitle.split(" ").slice(0, 50).join(" ")}{article.subtitle.split(" ").length > 50 ? "..." : ""}
                </p>    
                <div className="text-xs md:text-sm lg:text-base text-gray-500 mt-2">
                  {article.category}
                </div>
                <div className="text-xs md:text-sm lg:text-base text-gray-400 mt-1">
                  Published on {new Date(article.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center items-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 border ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              } rounded-lg`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
  )
}

export default RelatedBlogs