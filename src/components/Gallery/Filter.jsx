import React, { useState } from "react";
import SuiLogo from "../../assets/sui-symbol.png";
import CalendarSymbol from "../../assets/calendar-white.png";

const Filter = ({ jobPostings, width, selectedCategory, setSelectedCategory }) => {
  const uniqueCategories = [...new Set(jobPostings.map((post) => post.category))];
  
  const jobPostingCounts = uniqueCategories.map((category) => ({
    category,
    len: jobPostings.filter((post) => post.category === category).length,
  }));
  
  const [rewardsSymbol, setRewardsSymbol] = useState("SUI");
  const [sortOption, setSortOption] = useState("DATE");
  
  const handleRewardsSymbolToggle = () => {
    setRewardsSymbol(rewardsSymbol === "SUI" ? "USD" : "SUI");
  };

  const handleSortOptionToggle = () => {
    setSortOption(sortOption === "DATE" ? "ALPHABET" : "DATE");
  };
  
  const handleResetToggle = () => {
    setSelectedCategory('');
    setRewardsSymbol("SUI");
    setSortOption("DATE");
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  
  return (
    <div className="filter m-0.5 font-inter aspect-square flex flex-col justify-between rounded-3xl py-3 px-1.5 bg-gray-800" style={{ width: `${width}px` }}>
      <div className="filter-item-container flex flex-col items-center">
      {jobPostingCounts.map(({ category, len }) => (
        <div 
          className={`filter-item flex justify-between items-center w-full max-h-28 rounded-2xl ${selectedCategory === category ? 'bg-ssblue' : 'bg-gray-700'} mb-1 ease-in-out duration-300 hover:bg-gray-800 hover:cursor-pointer`}
          key={category}
          onClick={() => handleCategoryClick(category)} 
        >
          <p className={`filter-text ml-3 ${selectedCategory === category ? 'text-black' : 'text-faded'} text-xs ease-in-out duration-300`}>{category?.toUpperCase()}</p>
          <p className={`filter-quantity ${selectedCategory === category ? 'text-black' : 'text-gray-400'} mr-3 text-sm ease-in-out duration-300`}>{len}</p>
        </div>
      ))}
      </div>
      <div className="filter-switch flex justify-evenly">
        <div className="switch flex items-center justify-around w-14 h-7 bg-slate-900 rounded-2xl cursor-pointer text-white ease-in-out duration-300 hover:bg-gray-800" onClick={handleRewardsSymbolToggle}>
          <div className={`currency-text flex items-center justify-center w-6 h-6`}>
            <img src={SuiLogo} alt="sui-symbol" className={`"filter-image ml-2 w-3/6 ease-in-out duration-300 ${rewardsSymbol === "SUI" ? "opacity-100" : "opacity-30" }`} />
          </div>
          <div className={`currency-text mr-1 flex justify-center w-6 h-6 ease-in-out duration-300 ${rewardsSymbol === "USD" ? "opacity-100" : "opacity-30" }`}>
            $
          </div>
        </div>
        <div className="switch flex items-center justify-around w-14 h-7 bg-slate-900 rounded-2xl cursor-pointer text-white ease-in-out duration-300 hover:bg-gray-800" onClick={handleSortOptionToggle}>
          <div className={`currency-text flex items-center justify-center w-6 h-6`}>
            <img src={CalendarSymbol} alt="calendar-symbol" className={`filter-image ml-2 w-3/6 ease-in-out duration-300 ${sortOption === "DATE" ? "opacity-100" : "opacity-30"}`} />
          </div>
          <div className={`currency-text mr-1 flex items-center justify-center w-6 h-6 text-xs ease-in-out duration-300 ${sortOption === "ALPHABET" ? "opacity-100" : "opacity-30"}`}>
            aA
          </div>
        </div>
        <div className="flex items-center justify-around w-24 h-7 bg-slate-900 rounded-2xl cursor-pointer text-faded font-bold ease-in-out duration-300 text-xs hover:bg-gray-800" onClick={handleResetToggle}>
          RESET
        </div>
      </div>
    </div>
  );
};

export default Filter;
