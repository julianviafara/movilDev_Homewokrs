export default function SearchBar({ value, onChange }) {
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o CC..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }