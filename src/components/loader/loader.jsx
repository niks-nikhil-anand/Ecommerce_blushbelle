"use client"
import { motion } from 'framer-motion';
import { PropagateLoader } from 'react-spinners';

const Loader = () => {
  return (
    <motion.div
      className="flex justify-center items-center min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PropagateLoader color="#3498db" size={15} speedMultiplier={1} />
    </motion.div>
  );
};

export default Loader;
