

const GenderCheckbox = ({onCheckboxChange, selectedGender}) => {
  return (
    <div className="flex">
        <div className="form-control">
            <label className={`label gap-2 cursor-pointer ${selectedGender === "male" ? "selected" : "" }`}>
                <span className="label-text text-gray-400">Male</span>
                <input type="checkbox"  className="checkbox border-slate-900 bg-slate-300" 
                checked={selectedGender === "male"} 
                onChange={() => onCheckboxChange("male")} />
            </label>

        </div>
        <div className="form-control">
            <label className={`label gap-2 cursor-pointer ${selectedGender === "female" ? "selected" : "" }`}>
                <span className="label-text text-gray-400">Female</span>
                <input type="checkbox"  className="checkbox border-slate-900 bg-slate-300" 
                checked={selectedGender === "female"} 
                onChange={() => onCheckboxChange("female")} />
            </label>
        </div>
    </div>
  )
}

export default GenderCheckbox;


// STATER CODE 
//     <div className="flex">
//         <div className="form-control">
//             <label className={`label gap-2 cursor-pointer`}>
//                 <span className="label-text">Male</span>
//                 <input type="checkbox"  className="checkbox border-slate-900 bg-slate-300" />
//             </label>

//         </div>
//         <div className="form-control">
//             <label className={`label gap-2 cursor-pointer`}>
//                 <span className="label-text">Female</span>
//                 <input type="checkbox"  className="checkbox border-slate-900 bg-slate-300" />
//             </label>
//         </div>
//     </div>
//   )
// }

// export default GenderCheckBox