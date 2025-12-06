import { useState } from "react";
import "./Dropdown.scss";

interface DropdownProps extends React.PropsWithChildren {
    name: string;
}

export default function Dropdown({ name, children }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="dropdown">
            <div className="dropdown__toggler" onClick={toggleDropdown}>
                <span>
                    {name}{" "}
                    <sp-icon
                        name="ui:ChevronDownMedium"
                        style={{ transform: `${isOpen ? "rotate(180deg)" : "rotate(0deg)"}` }}
                    ></sp-icon>
                </span>
            </div>
            {isOpen && children}
        </div>
    );
}
