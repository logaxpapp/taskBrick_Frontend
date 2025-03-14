import React from 'react';
import { motion } from 'framer-motion';

// Import your logos (make sure the paths are correct)
import flutterWave from '../../assets/images/flutterWave.png';
import relume from '../../assets/images/relume.png';
import piggyvest from '../../assets/images/piggyvest.png';
import google from '../../assets/images/google-pay.png';
import gatherPlux from '../../assets/images/verve.png';

const logos = [
  { src: flutterWave, alt: 'Flutterwave' },
  { src: relume, alt: 'Relume' },
  { src: piggyvest, alt: 'Piggyvest' },
  { src: google, alt: 'Google Pay' },
  { src: gatherPlux, alt: 'GatherPlux' },
];

const TrustedCompanies: React.FC = () => {
  const repeatedLogos = [...logos, ...logos];

  return (
    <section className="bg-gray-50 shadow-lg py-12 px-4 md:px-6 lg:px-8"> {/* Responsive padding */}
      <div className="max-w-7xl mx-auto"> {/* Center content */}
        <h2 className="text-center font-semibold text-xl md:text-2xl mb-10"> {/* Responsive font size */}
          Trusted by the world's best companies
        </h2>

        <div className="overflow-hidden relative"> {/* Outer container for overflow clipping */}
          <motion.div
            className="flex gap-6 md:gap-10 lg:gap-12" // Responsive gap
            style={{ whiteSpace: 'nowrap' }} // Prevent logos from wrapping
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              duration: 20, // Adjust speed
              ease: 'linear',
            }}
          >
            {repeatedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center min-w-[120px] md:min-w-[180px] lg:min-w-[240px]" // Responsive width
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-10 md:h-12 lg:h-14 object-contain" // Responsive height
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;