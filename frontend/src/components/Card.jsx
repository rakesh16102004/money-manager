const Card = ({ children, className = '', onClick, hover = true }) => {
    return (
        <div
            className={`card ${hover ? 'hover-lift' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
