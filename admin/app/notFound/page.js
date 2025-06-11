"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { FaSadTear } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1e3c72] to-[#2a5298] text-white">
      <motion.div
        className="text-9xl font-extrabold drop-shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        404
      </motion.div>

      <motion.div
        className="mt-6 text-2xl flex items-center gap-2"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <FaSadTear className="text-3xl text-yellow-300 animate-bounce" />
        Page Not Found
      </motion.div>

      <motion.a
        href="/"
        className="mt-8 px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 transition duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Go Home
      </motion.a>
    </div>
  );
};

export default NotFoundPage;