type PriceFilterProps = {
   selectedPrice?: number;
   onChange: (value?: number) => void;
};

function PriceFilter({ selectedPrice, onChange }: PriceFilterProps) {
   return (
      <div>
         <h4 className="text-md font-semibold mb-2">Max price in $</h4>
         <select
            className="p-2 border rounded"
            value={selectedPrice}
            onChange={(event) =>
               onChange(event.target.value ? parseInt(event.target.value) : undefined)
            }
         >
            <option value="">Select a max price</option>
            {[50, 100, 200, 500, 1000, 1500, 2000, 2500, 3000, 4000].map((price) => (
               <option key={price} value={price}>
                  {price}
               </option>
            ))}
         </select>
      </div>
   );
}

export default PriceFilter;
