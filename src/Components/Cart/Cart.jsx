import React from "react";
import { useState } from "react";
import { useContext } from "react";
import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const CartCtx = useContext(CartContext);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const totalAmount = `$${CartCtx.totalAmount.toFixed(2)}`;

  const hasItems = CartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    CartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    CartCtx.addItem({ ...item, amount: 1 });
  };

  const cartItem = (
    <ul className={classes["cart-items"]}>
      {CartCtx.items.map((item) => {
        return (
          <CartItem
            key={item.id}
            name={item.name}
            amount={item.amount}
            price={item.price}
            onRemove={cartItemRemoveHandler.bind(null, item.id)}
            onAdd={cartItemAddHandler.bind(null, item)}
          />
        );
      })}
    </ul>
  );

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const modalAction = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch(
      "https://react-http-7d068-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderItems: CartCtx.items,
        }),
      }
    );

    setIsSubmitting(false);
    setDidSubmit(true);

    CartCtx.clearCart();
  };

  const cartModalContent = (
    <>
      {cartItem}
      <div className={classes.total}>
        <span>Total amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}

      {!isCheckout && modalAction}
    </>
  );

  const isSubmittingModalContent = <p>Sending modal data...</p>;

  const didSubmitModalContent = (
    <>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>
      </div>
    </>
  );

  return (
    <>
      <Modal onClose={props.onClose}>
        {!isSubmitting && !didSubmit && cartModalContent}
        {isSubmitting && isSubmittingModalContent}
        {!isSubmitting && didSubmit && didSubmitModalContent}
      </Modal>
    </>
  );
};

export default Cart;
