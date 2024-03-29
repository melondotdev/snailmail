import React, { useState } from "react";
import "./Filter.css";
import SuiLogo from "../../assets/sui-symbol.png";
import CalendarSymbol from "../../assets/calendar-white.png";

const Filter = ({ jobPostings, width }) => {
  // Get job postings from Gallery.jsx and map to a new array with all categories
  // and their respective number of postings that fall under that category
  
  const uniqueCategories = [
    ...new Set(jobPostings.map((post) => post.category)),
  ];
  
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
    setRewardsSymbol("SUI");
    setSortOption("DATE");
  };

  return (
    <div className="filter" style={{width: `${width}px`}}>
      <div className="filter-item-container">
        {jobPostingCounts.map(({ category, len }) => (
          <div className="filter-item" key={category}>
            <p className="filter-text">{category.toUpperCase()}</p>
            <p className="filter-quantity">{len}</p>
          </div>
        ))}
      </div>
      <div className="filter-switch">
        <div className="switch" onClick={handleRewardsSymbolToggle}>
          <div className={`currency-indicator ${rewardsSymbol}`}>
            <div className={`currency-text ${rewardsSymbol === "SUI" ? "active" : ""}`}>
              <img src={SuiLogo} alt="sui-symbol" className="filter-image" />
            </div>
            <div className={`currency-text ${rewardsSymbol === "USD" ? "active" : ""}`}>
              $
            </div>
          </div>
        </div>
        <div className="switch" onClick={handleSortOptionToggle}>
          <div className={`currency-indicator ${sortOption}`}>
            <div className={`currency-text ${sortOption === "DATE" ? "active" : ""}`}>
              <img src={CalendarSymbol} alt="calendar-symbol" className="filter-image" />
            </div>
            <div className={`currency-text ${sortOption === "ALPHABET" ? "active" : ""}`} style={{ fontSize: "10px" }}>
              A-Z
            </div>
          </div>
        </div>
        <div className="switch" style={{ color: "rgb(209, 209, 209)", width: `${width-130}px`, fontSize: "0.7rem" }} onClick={handleResetToggle}>
          RESET
        </div>
      </div>
    </div>
  );
};

export default Filter;
