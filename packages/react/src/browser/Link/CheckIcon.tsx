import React, { FunctionComponent } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

interface CheckIconProps {
	status: boolean;
}

const CheckIcon: FunctionComponent<CheckIconProps> = ({ status }) => {
	return status ? (
		<IoMdCheckmarkCircleOutline className="h-3.5 w-3.5 text-green-500" />
	) : (
		<MdErrorOutline className="h-3.5 w-3.5 text-red-500" />
	);
};

export default CheckIcon;
