export default function TextInput({ name, label, placeholder, value, onValueChange, type = 'text' }) {

  function handleInputChange(e) {
    let newValue = e.target.value;

    if (type === 'checkbox') {
      newValue = e.target.checked;
    } else if (type === 'file') {
      newValue = e.target.files[0]; // Assume only one file is selected
    }

    onValueChange(newValue);
  }

  return (
    <div>
      <label htmlFor={name + '_input'} className="block font-bold mb-2">{label}</label>

      {type === 'file' ? (
        <input
          type="file"
          name={name}
          id={name + '_input'}
          className="border px-3 py-4 w-full"
          onChange={handleInputChange}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          id={name + '_input'}
          className="border px-3 py-4 w-full"
          {...{
            value: type !== 'checkbox' ? value : undefined,
            checked: type === 'checkbox' ? value : undefined,
          }}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
}
