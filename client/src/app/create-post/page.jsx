import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import ImageUploadComponent from '@/components/ImageUploadComponent';
import { carBrands, bodies, carModels } from '../Lists';
import { countries, states, colors, interior_colors, fuels, tractions } from '../Lists';
import { useCreatePostMutation } from '@/redux/slices/apiSlice';

const CreatePostPage = () => {

  const transmissions = ['Automatic', 'Manual'];

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [traction, setTraction] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [enginePower, setEnginePower] = useState('');
  const [transmission, setTransmission] = useState('');
  const [body, setBody] = useState('');
  const [numberOfDoors, setNumberOfDoors] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [color, setColor] = useState('');
  const [interiorColor, setInteriorColor] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);
  const [stateValue, setStateValue] = useState('');
  const [city, setCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [errors, setErrors] = useState({});

  const CustomSelect1 = ({ placeholder, arrayOfValues, required, onSelect, value, error }) => (
    <div className="space-y-1">
      <Select
        required={required}
        onValueChange={(value) => {
          onSelect(value);
        }}
        value={value}
        aria-invalid={error ? "true" : "false"}
      >
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {arrayOfValues.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              <div className='flex flex-row items-center gap-3'>
                <img src={item.icon} alt={`${item.name} icon`} className='size-8 object-cover'/>
                {item.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );

  const CustomSelect = ({ placeholder, arrayOfValues, required, disabled, onValueChange, value, error }) => (
    <div className="space-y-1">
      <Select
        required={required}
        disabled={disabled ? true : false}
        onValueChange={onValueChange}
        value={value}
        aria-invalid={error ? "true" : "false"}
      >
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {arrayOfValues.map((val) => (
            <SelectItem key={val} value={val}>
              {val}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );

  const handleMakeSelection = (value) => {
    setSelectedMake(value);
    const modelsForMake = carModels[value] || [];
    setAvailableModels(modelsForMake);
  };

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleCreatePost = async (e) => {
    e.preventDefault();

    setErrors({});

    const newErrors = {};

    if (!selectedMake) newErrors.make = "Make is required.";
    if (!model) newErrors.model = "Model is required.";
    if (!year) newErrors.year = "Year is required.";
    if (!price) newErrors.price = "Price is required.";
    if (!mileage) newErrors.mileage = "Mileage is required.";
    if (!fuelType) newErrors.fuelType = "Fuel type is required.";
    if (!traction) newErrors.traction = "Traction is required.";
    if (!engineSize) newErrors.engineSize = "Engine size is required.";
    if (!enginePower) newErrors.enginePower = "Engine power is required.";
    if (!transmission) newErrors.transmission = "Transmission is required.";
    if (!body) newErrors.body = "Body type is required.";
    if (!numberOfDoors) newErrors.numberOfDoors = "Number of doors is required.";
    if (!numberOfSeats) newErrors.numberOfSeats = "Number of seats is required.";
    if (!color) newErrors.color = "Exterior color is required.";
    if (!interiorColor) newErrors.interiorColor = "Interior color is required.";
    if (!selectedCountry) newErrors.country = "Country is required.";
    if (!stateValue) newErrors.state = "State is required.";
    if (!city) newErrors.city = "City is required.";
    if (!streetAddress) newErrors.streetAddress = "Street address is required.";
    if (!zipCode) newErrors.zipCode = "Zip code is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const formData = new FormData();

    formData.append('title', `${selectedMake} ${model} ${enginePower}HP`);
    formData.append('status', 'active');
    formData.append('country', `${selectedCountry}`);
    formData.append('state', `${stateValue}`);
    formData.append('city', `${city}`);
    formData.append('zip_code', `${zipCode}`);
    formData.append('street_address', `${streetAddress}`);
    formData.append('year', `${year}`);
    formData.append('price', `${price}`);
    formData.append('brand', `${selectedMake}`);
    formData.append('model', `${model}`);
    formData.append('mileage', `${mileage}`);
    formData.append('fuel', `${fuelType}`);
    formData.append('traction', `${traction}`);
    formData.append('engine_size', `${engineSize}`);
    formData.append('engine_power', `${enginePower}`);
    formData.append('transmission', `${transmission}`);
    formData.append('color', `${color}`);
    formData.append('interior_color', `${interiorColor}`);
    formData.append('body', `${body}`);
    formData.append('number_of_doors', `${numberOfDoors}`);
    formData.append('number_of_seats', `${numberOfSeats}`);
    formData.append('notes', `${notes}`);
    
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const createdPost = await createPost(formData).unwrap();
      console.log("Post created successfully:", createdPost);
      window.location.href = `/posts`;
    } catch (err) {
      console.error('Failed to create post:', err);
      setErrors(prev => ({ ...prev, general: "Failed to create post. Please try again later." }));
    }
  };

  const isFormValid = () => {
    return (
      selectedMake &&
      model &&
      year &&
      price &&
      mileage &&
      fuelType &&
      traction &&
      engineSize &&
      enginePower &&
      transmission &&
      body &&
      numberOfDoors &&
      numberOfSeats &&
      color &&
      interiorColor &&
      selectedCountry &&
      stateValue &&
      city &&
      streetAddress &&
      zipCode
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-extrabold mb-8">Create new post</h1>
      
      <form className="space-y-8" onSubmit={handleCreatePost}>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-6">Car details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <Label>
                  Make <span className="text-red-500">*</span>
                </Label>
                <CustomSelect1
                  placeholder={selectedMake ? selectedMake : "Select make"}
                  arrayOfValues={carBrands}
                  required
                  onSelect={handleMakeSelection}
                  value={selectedMake}
                  error={errors.make}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Model <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  placeholder={model ? model : "Select model"}
                  arrayOfValues={availableModels}
                  required
                  disabled={!selectedMake}
                  onValueChange={(value) => setModel(value)}
                  value={model}
                  error={errors.model}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  First Registration <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  min="1900" 
                  max="2025" 
                  required 
                  placeholder="Year"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e)=>setYear(e.target.value)} 
                  value={year}
                />
                {errors.year && <span className="text-red-500 text-sm">{errors.year}</span>}
              </div>
              <div className="space-y-2">
                <Label>
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  required 
                  placeholder="Price"
                  min="0"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e)=>setPrice(e.target.value)} 
                  value={price}
                />
                {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <Label>
                  Mileage <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  placeholder="Mileage"
                  min='0'
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                  onChange={(e)=>setMileage(e.target.value)} 
                  value={mileage}
                />
                {errors.mileage && <span className="text-red-500 text-sm">{errors.mileage}</span>}
              </div>
              <div className="space-y-2">
                <Label>
                  Fuel Type <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  placeholder={fuelType ? fuelType : "Select fuel type"}
                  arrayOfValues={fuels}
                  required={true}
                  onValueChange={(value) => setFuelType(value)}
                  value={fuelType}
                  error={errors.fuelType}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Traction <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  placeholder={traction ? traction : "Select traction"}
                  arrayOfValues={tractions}
                  required={true}
                  onValueChange={(value) => setTraction(value)}
                  value={traction}
                  error={errors.traction}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Engine Size <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="10000" 
                  placeholder="Engine size (ex: 2500, 1800 etc.)"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e)=>setEngineSize(e.target.value)} 
                  value={engineSize}
                />
                {errors.engineSize && <span className="text-red-500 text-sm">{errors.engineSize}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <Label>
                  Engine Power (HP) <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  max="10000" 
                  min="10" 
                  placeholder="Engine power"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e)=>setEnginePower(e.target.value)} 
                  value={enginePower}
                />
                {errors.enginePower && <span className="text-red-500 text-sm">{errors.enginePower}</span>}
              </div>
              <div className="space-y-2">
                <Label>
                  Transmission <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  placeholder={transmission ? transmission : "Select transmission"}
                  arrayOfValues={transmissions}
                  required
                  onValueChange={(value) => setTransmission(value)}
                  value={transmission}
                  error={errors.transmission}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Body Type <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  placeholder={body ? body : "Select body type"}
                  arrayOfValues={bodies}
                  required
                  onValueChange={(value) => setBody(value)}
                  value={body}
                  error={errors.body}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Number of Doors <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="10" 
                  placeholder="Number of doors" 
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e)=>setNumberOfDoors(e.target.value)} 
                  value={numberOfDoors}
                />
                {errors.numberOfDoors && <span className="text-red-500 text-sm">{errors.numberOfDoors}</span>}
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label>
                  Number of Seats <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="60" 
                  placeholder="Number of seats" 
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e)=>setNumberOfSeats(e.target.value)} 
                  value={numberOfSeats}
                />
                {errors.numberOfSeats && <span className="text-red-500 text-sm">{errors.numberOfSeats}</span>}
              </div>
              <div className="space-y-2">
                <Label>
                  Exterior Color <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  placeholder={color ? color : "Select exterior color"}
                  arrayOfValues={colors}
                  onValueChange={(value) => setColor(value)}
                  value={color}
                  required
                  error={errors.color}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Interior Color <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  placeholder={interiorColor ? interiorColor : "Select interior color"}
                  arrayOfValues={interior_colors}
                  onValueChange={(value) => setInteriorColor(value)}
                  value={interiorColor}
                  required
                  error={errors.interiorColor}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">More details</Label>
              <Textarea 
                placeholder="Add here more details about the car." 
                id="message"
                className="min-h-32" 
                onChange={(e)=>setNotes(e.target.value)} 
                value={notes}
              />
              {errors.notes && <span className="text-red-500 text-sm">{errors.notes}</span>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-6">Images</h3>
            <ImageUploadComponent setImages={setImages}/>
            {errors.images && <span className="text-red-500 text-sm">{errors.images}</span>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-6">Location details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  Country <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  placeholder={
                    selectedCountry === 'Italy' ? 'Italy' : 
                    selectedCountry === 'Romania' ? 'Romania' : 
                    "Select country"
                  } 
                  arrayOfValues={countries} 
                  required 
                  value={selectedCountry} 
                  onValueChange={(value) => setSelectedCountry(value)}
                  error={errors.country}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  State <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  placeholder={stateValue ? stateValue : "Select state"}
                  arrayOfValues={selectedCountry ? states[selectedCountry] : []}
                  disabled={!selectedCountry}
                  required 
                  onValueChange={(value) => setStateValue(value)}
                  value={stateValue}
                  error={errors.state}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  City <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="text" 
                  placeholder="City" 
                  onChange={(e) => setCity(e.target.value)} 
                  value={city} 
                  required 
                />
                {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
              </div>
              <div className="space-y-2">
                <Label>
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="text" 
                  placeholder="Street address" 
                  onChange={(e) => setStreetAddress(e.target.value)} 
                  value={streetAddress} 
                  required 
                />
                {errors.streetAddress && <span className="text-red-500 text-sm">{errors.streetAddress}</span>}
              </div>
              <div className="space-y-2">
                <Label>
                  Zip Code <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="text" 
                  placeholder="Zip code" 
                  onChange={(e) => setZipCode(e.target.value)} 
                  value={zipCode} 
                  required 
                />
                {errors.zipCode && <span className="text-red-500 text-sm">{errors.zipCode}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {errors.general && <div className="text-red-500 text-center">{errors.general}</div>}

        <button
          type='submit'
          className={`bg-red-500 text-white text-lg font-bold py-2 px-24 ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
