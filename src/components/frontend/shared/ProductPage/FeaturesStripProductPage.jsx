import React from 'react';
import { FlaskConical, ShieldCheck, Leaf, Award, Clock, Heart } from "lucide-react";

const FeaturesStrip = () => {
  const features = [
    {
      icon: <FlaskConical className="w-6 h-6" />,
      title: "Clinically Tested"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "100% Guarantee"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "100% Herbal"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "FDA Approved"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Fast Acting"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Safe & Natural"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-3 group hover:transform hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-green-700 transition-colors duration-200">
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-green-800 leading-tight">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesStrip;