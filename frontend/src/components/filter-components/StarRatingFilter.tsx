type StarRatingFilterProps = {
   selectedStars: string[];
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function StarRatingFilter({ selectedStars, onChange }: StarRatingFilterProps) {
   return (
      <div className="border-b pb-5">
         <h4 className="text-md font-semibold mb-2">Property rating</h4>
         {["5", "4", "3", "2", "1"].map((star) => (
            <label key={star} className="flex items-center space-x-2">
               <input
                  type="checkbox"
                  className="rounded"
                  value={star}
                  checked={selectedStars.includes(star)}
                  onChange={onChange}
               />

               <span>{star} Stars</span>
            </label>
         ))}
      </div>
   );
}

export default StarRatingFilter;
