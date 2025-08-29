import React from "react";

const BookCard = ({ book }) => {
    const { title, authors, imageLinks } = book.volumeInfo;

    return (
        <div>
            <h3>{title}</h3>
            <p>by {authors ? authors.join(", ") : "Unknown Author"}</p>
            {imageLinks && imageLinks.thumbnail && (
                <img src={imageLinks.thumbnail} alt={`Cover for ${title}`} />
            )}
        </div>
    );
};
export default BookCard;