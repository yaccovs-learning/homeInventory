import React, { useEffect, useState } from "react";

const UserProductInput = ({ initial, onChange, min, max }) => {
  const [count, setCount] = useState();
  const [editAble, setEditAble] = useState(false);

  min = min || 0;
  max = max || Infinity;

  const handlePlus = () => {
    setCount((prev) => {
      if (prev + 1 > max) {
        return max;
      }
      prev++;
      return prev;
    });
  };
  const handleMinus = () => {
    setCount((prev) => {
      if (prev - 1 < min) {
        return min;
      }
      prev--;
      return prev;
    });
  };

  const handleChange = (num) => {
    setCount(() => {
      if (num > max) {
        return max;
      } else if (num < min) {
        return min;
      }
      return num;
    });
  };

  const handleUpdate = () => {
    setEditAble(false);
    onChange(count - initial);
  };

  const isChange = () => initial !== count;

  useEffect(() => {
    setCount(initial);
    setEditAble(false);
    return () => {};
  }, [initial]);

  return (
    <div
      style={{
        display: "flex-inline",
        flexDirection: "column",
        width: "fit-content",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "fit-content",
          boxSizing: "border-box",
          backgroundColor: isChange() ? "orange" : "inherit",
        }}
      >
        <button onClick={handlePlus}>+</button>
        {editAble ? (
          <input
            type={"number"}
            value={count}
            onChange={(e) => handleChange(e.target.value)}
          />
        ) : (
          <div onDoubleClick={() => setEditAble(true)}>{count}</div>
        )}
        <button onClick={handleMinus}>-</button>
      </div>
      {isChange() ? (
        <button onClick={handleUpdate}>עדכן</button>
      ) : (
        <div>מעודכן</div>
      )}
    </div>
  );
};

export default UserProductInput;
