const AsyncEventViewer = ({ data, isVisible }) => {
  return (
    <div
      style={{
        display: isVisible ? "flex" : "none",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      <h1>hello</h1>
    </div>
  );
};

export default AsyncEventViewer;
