import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = "",
    icon: Icon, 
}) => {      
    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full rounded-lg border
                        ${error ? 'border-red-500' : 'border-gray-300'}
                        ${Icon ? 'pl-10' : 'pl-4'}
                        py-2 pr-4
                        focus:outline-none focus:ring-2
                        ${error 
                            ? 'focus:ring-red-200 focus:border-red-500' 
                            : 'focus:ring-blue-200 focus:border-blue-500'
                        }
                        disabled:bg-gray-50 disabled:text-gray-500
                        placeholder:text-gray-400
                        text-gray-900
                        ${className}
                    `}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    icon: PropTypes.elementType,
};

export default Input;
