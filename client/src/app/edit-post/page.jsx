import React, {useState} from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import ImageUploadComponent from '@/components/ImageUploadComponent';
import { carBrands, bodies, carModels } from '../Lists';

const EditPostPage = () => {
  // Your existing arrays
  const makes = [];
  const transmissions = ['Automatic', 'Manual'];
  const fuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG'];
  const tractions = ['RWD', 'FWD', 'AWD', '4WD'];
  const exteriorColors = [];
  const interiorColors = [];
  const countries = [];
  const states = [];

  const [selectedMake, setSelectedMake] = useState('');
  const [availableModels, setAvailableModels] = useState([]);

  const CustomSelect1 = ({ placeholder, arrayOfValues, required, onSelect }) => (
    <Select required={required} onValueChange={(value) => {
      onSelect(value);
    }} value={selectedMake}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {arrayOfValues.map((value) => (
          <SelectItem key={value.name} value={value.name}>
            <div className='flex flex-row items-center gap-3'>
            <img src={value.icon} className='size-8 object-cover'/>
            {value.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const CustomSelect = ({ placeholder, arrayOfValues, required, disabled }) => (
    <Select required={required} disabled={disabled? true: false}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {arrayOfValues.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const handleMakeSelection = (value) => {
    setSelectedMake(value);
    const modelsForMake = carModels[value] || [];
    setAvailableModels(modelsForMake);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-extrabold mb-8">Edit post</h1>
      
      <form className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-6">Car details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <Label>Make</Label>
                <CustomSelect1 placeholder="Select make" arrayOfValues={carBrands} required onSelect={handleMakeSelection}/>
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <CustomSelect placeholder="Select model" arrayOfValues={availableModels} required disabled={!selectedMake}/>
              </div>
              <div className="space-y-2">
                <Label>First Registration</Label>
                <Input 
                  type="number" 
                  min="1900" 
                  max="2025" 
                  required 
                  placeholder="Year"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input 
                  type="number" 
                  required 
                  placeholder="Price"
                  min="0"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <Label>Mileage</Label>
                <Input 
                  type="number" 
                  placeholder="Mileage"
                  min='0'
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <CustomSelect placeholder="Select fuel type" arrayOfValues={fuels} required/>
              </div>
              <div className="space-y-2">
                <Label>Traction</Label>
                <CustomSelect placeholder="Select traction" arrayOfValues={tractions} requirex/>
              </div>
              <div className="space-y-2">
                <Label>Engine Size</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="2200" 
                  placeholder="Engine size (ex: 2500, 1800 etc.)"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <Label>Engine Power (HP)</Label>
                <Input 
                  type="number" 
                  max="10000" 
                  min="100" 
                  placeholder="Engine power"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Transmission</Label>
                <CustomSelect placeholder="Select transmission" arrayOfValues={transmissions} required/>
              </div>
              <div className="space-y-2">
                <Label>Body Type</Label>
                <CustomSelect placeholder="Select body type" arrayOfValues={bodies} required/>
              </div>
              <div className="space-y-2">
                <Label>Number of Doors</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="10" 
                  placeholder="Number of doors" 
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label>Number of Seats</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="60" 
                  placeholder="Number of seats" 
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Exterior Color</Label>
                <CustomSelect placeholder="Select exterior color" arrayOfValues={exteriorColors} required />
              </div>
              <div className="space-y-2">
                <Label>Interior Color</Label>
                <CustomSelect placeholder="Select interior color" arrayOfValues={interiorColors} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">More details</Label>
              <Textarea 
                placeholder="Add here more details about the car." 
                id="message"
                className="min-h-32" 
              />
            </div>
          </CardContent>
        </Card>



        <Card>
            <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-6">Images</h3>
                <ImageUploadComponent/>
            </CardContent>
        </Card>


        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-6">Location details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Country</Label>
                <CustomSelect placeholder="Select country" arrayOfValues={countries} required />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <CustomSelect placeholder="Select state" arrayOfValues={states} required />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input type="text" placeholder="City" required />
              </div>
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input type="text" placeholder="Street address" required />
              </div>
              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input type="text" placeholder="Zip code" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <button type='submit' className='bg-red-500 text-white text-lg font-bold py-2 px-24'>Save changes</button>
      </form>
    </div>
  );
};

export default EditPostPage;