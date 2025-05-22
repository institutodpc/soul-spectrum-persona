
import React from "react";
import NameField from "./fields/NameField";
import LastNameField from "./fields/LastNameField";
import DateOfBirthField from "./fields/DateOfBirthField";
import GenderField from "./fields/GenderField";

const PersonalInfoFields = () => {
  return (
    <>
      <NameField />
      <LastNameField />
      <DateOfBirthField />
      <GenderField />
    </>
  );
};

export default PersonalInfoFields;
