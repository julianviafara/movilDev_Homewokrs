interface NaipeCardProps {
  email: string;
  password: string;
  onDeal: () => void;
}

const NaipeCard: React.FC<NaipeCardProps> = ({ email, password, onDeal }) => {
  return (
    <div className="naipe-wrap">
      <button type="button" className="naipe" onClick={onDeal} aria-label="Deal mock login credentials">
        <span className="naipe-corner naipe-corner--tl">
          <span className="naipe-index">J</span>
          <span className="naipe-suit">♦</span>
        </span>

        <div className="naipe-inner">
          <div className="naipe-smile" aria-hidden="true" />
          <div className="naipe-mark">Joker</div>
          <p className="naipe-label">User</p>
          <p className="naipe-value">{email}</p>
          <p className="naipe-label">Password</p>
          <p className="naipe-value">{password}</p>
        </div>

        <span className="naipe-corner naipe-corner--br">
          <span className="naipe-index">J</span>
          <span className="naipe-suit">♦</span>
        </span>
      </button>
    </div>
  );
};

export default NaipeCard;
