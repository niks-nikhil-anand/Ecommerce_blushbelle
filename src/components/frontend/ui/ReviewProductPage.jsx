import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewProductPage = ({ productId }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: '',
    reviewTitle: '',
    review: ''
  });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {

        const urlPath = window.location.pathname;
        const id = urlPath.substring(urlPath.lastIndexOf('/') + 1);
        console.log("fetching review...........")
        console.log(id)
        const response = await axios.get(`/api/admin/dashboard/review/${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/admin/dashboard/review/addReview`, { ...formData, productId });
      setReviews([...reviews, response.data]); // Append new review to existing reviews
      setShowForm(false); // Hide form after submission
      setFormData({
        name: '',
        rating: '',
        reviewTitle: '',
        review: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      {/* Display Review Summary */}
      <div className="flex items-center mb-4">
        <span className="text-lg font-bold">Based on {reviews.length} reviews</span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-auto p-2 border rounded hover:bg-gray-100"
        >
          Write a review
        </button>
      </div>

      {/* Display Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 border-t pt-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="rating">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
              min="1"
              max="5"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="reviewTitle">Review Title</label>
            <input
              type="text"
              id="reviewTitle"
              name="reviewTitle"
              value={formData.reviewTitle}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="review">Review</label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Display Existing Reviews */}
      <div>
        {reviews.map((review, index) => (
          <div key={index} className="border-t pt-4 mt-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                {review.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-semibold">{review.name}</span>
                <span className="text-sm text-gray-500 ml-2">{review.date}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
              <span className="text-gray-400 ml-2">{'☆'.repeat(5 - review.rating)}</span>
            </div>
            <p className="font-semibold mt-1">{review.reviewTitle}</p>
            <p className="text-gray-700">{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewProductPage;
