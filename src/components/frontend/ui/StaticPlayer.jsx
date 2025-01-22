import Image from 'next/image';
import bgImage from '../../../../public/frontend/player/image9.png';
import playerIcon from '../../../../public/frontend/player/Group15.png';

const StaticPlayer = () => {
  return (
    <div
      className="relative h-[80vh] flex items-center justify-center bg-cover bg-center sm:h-[50vh] md:h-[70vh]"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <div className="text-center text-white max-w-3xl px-4">
        {/* Play Button */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg sm:w-12 sm:h-12 md:w-16 md:h-16"
            style={{ boxShadow: '0 0 15px 5px rgba(255, 255, 255, 0.5)' }}
          >
            <Image src={playerIcon} alt="Play Icon" width={30} height={30} />
          </div>
        </div>
        {/* Heading */}
        <h1 className="font-bold text-lg sm:text-base md:text-2xl mb-4 leading-tight">
          BrainBite™ Smart IQ is a{' '}
          <span className="text-green-500">100%</span> plant-based brain
          supplement, designed with a science-backed formula to elevate your
          mental performance.
        </h1>
        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base mb-6 leading-relaxed">
          Whether you&apos;re a student, professional, or anyone looking to
          enhance focus, cognitive energy, and mental clarity, BrainBite™ is
          your go-to solution.
        </p>
        {/* Button */}
        <button className="bg-green-600 text-white px-4 py-2 sm:px-3 sm:py-1 md:px-6 md:py-2 rounded-full hover:bg-green-700 transition shadow-lg">
          View Products
        </button>
      </div>
    </div>
  );
};

export default StaticPlayer;
