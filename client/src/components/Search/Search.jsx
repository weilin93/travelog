import './Search.scss';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails,
} from 'use-places-autocomplete';

//input box styling
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox';
import '@reach/combobox/styles.css';

import Form from '../Form/Form';

function Search({
  panTo,
  setMarkers,
  showForm,
  setShowForm,
  details,
  setDetails,
  setEdit,
  edit,
}) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    //optional: pass in options
    requestOptions: {
      location: { lat: () => 3.119306, lng: () => 101.69351 },
      radius: 200 * 1000,
    },
  });

  async function handleOnSelect(address) {
    //set value again and update state to selected add and set 2nd arg "should fetch data" to false
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const result = results[0];
      const { lat, lng } = await getLatLng(result);
      panTo({ lat, lng });
      const { place_id } = result;
      const details = await getDetails({ placeId: place_id });

      setDetails({ place_name: details.name, place_id,  lat, lng  });
    } catch (error) {
      console.log(error);
    }
  }

  function handleAddClick(e) {
    setShowForm(true);
    setValue('', false);
  }

  const comboOptionsStyle = {
    padding: '1rem',
    lineHeight: '2rem',
    fontSize: '1.6rem',
  };

  return (
    <div className='search'>
      <div className='search-bar'>
        <Combobox
          className='search-bar-container'
          onSelect={(address) => handleOnSelect(address)}
        >
          <ComboboxInput
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disabled={!ready}
            placeholder='Search a place...'
          />
          <ComboboxPopover>
            <ComboboxList>
              {status === 'OK' &&
                data.map(({ place_id, description }) => (
                  <ComboboxOption
                    style={comboOptionsStyle}
                    key={place_id}
                    value={description}
                  />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
        {details && (
          <button
            className='add-btn'
            onClick={handleAddClick}
            disabled={showForm}
          >
            +
          </button>
        )}
      </div>

      {details && (
        <div className={showForm ? 'show' : 'hide'}>
          <Form
            setDetails={setDetails}
            details={details}
            setMarkers={setMarkers}
            setShowForm={setShowForm}
            showForm={showForm}
            setEdit={setEdit}
            edit={edit}
          />
        </div>
      )}
    </div>
  );
}

export default Search;
