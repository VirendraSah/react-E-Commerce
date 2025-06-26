function Label({label}){
    return(
        <>
            <label htmlFor={label.replace(/\s+/g, '-')} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        </>
    )
}

function Textarea({label}) {
    return (
        <div class="max-w-full mx-3 mb-2">
            <label for="message" class="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 " placeholder="Write your thoughts here..."></textarea>
        </div>
    )
}

function Validateinputbox({ register, value, errors, placeholder, name, type, rules, classname}) {
    return (
        <>
            <input type={type} {...register(`${name}`,
                {
                    required: `${name} is requird`, ...rules
                }
            )}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 ${classname}`} 
                placeholder={placeholder}
                defaultValue={value}
                autoComplete={type ==='password' ? 'current-password' : 'off'} 
            />

            {errors[name] && <span className='text-red-600 z-3'>{errors[name].message}</span>}
        </>
    )
}

export {Textarea, Label, Validateinputbox }