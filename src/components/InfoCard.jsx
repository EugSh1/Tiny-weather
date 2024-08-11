export default function InfoCard({ title, details, lowerDetails }) {
    return (
        <div className="info-card">
            <p className="info-card-title">{title}</p>
            <p className="info-card-details">{details}</p>
            {lowerDetails && (
                <p className="info-card-lower-details">{lowerDetails}</p>
            )}
        </div>
    );
}
