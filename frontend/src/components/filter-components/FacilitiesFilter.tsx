import { hotelFacilities } from "../../config/hotel-options";

type FacilitiesFilterProps = {
   selectedFacilities: string[];
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function FacilitiesFilter({ selectedFacilities, onChange }: FacilitiesFilterProps) {
   return (
      <div className="border-b pb-5">
         <h4 className="text-md font-semibold mb-2">Hotel type</h4>
         {hotelFacilities.map((facility) => (
            <label key={facility} className="flex items-center space-x-2">
               <input
                  type="checkbox"
                  className="rounded"
                  value={facility}
                  checked={selectedFacilities.includes(facility)}
                  onChange={onChange}
               />

               <span>{facility}</span>
            </label>
         ))}
      </div>
   );
}

export default FacilitiesFilter;
