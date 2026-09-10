import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-brand-100 rounded-lg mb-4">
        <img
          src={
            product.images[0] ||
            "https://via.placeholder.com/400x600?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-display font-semibold text-brand-900 truncate">
          {product.name}
        </h3>
        <p className="font-sans text-gray-500 text-sm">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
