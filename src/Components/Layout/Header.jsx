import React from "react";
import mealsImg from "../../assets/meals.jpg";
import HeaderCartButton from "./HeaderCartButton";
import classes from "./Header.module.css";

const Header = (props) => {
  return (
    <>
      <header className={classes.header}>
        <h1>React meals</h1>
        <HeaderCartButton onClick={props.onshowCart} />
      </header>
      <div className={classes["main-image"]}>
        <img src={mealsImg} alt="Table full of delicious food" />
      </div>
    </>
  );
};

export default Header;
