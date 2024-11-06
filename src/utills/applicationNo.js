function generateApplicationNumber(schoolName, day, month, year, randomNumber, appliedForClass) {
    // Take the first three letters of the school name
    const schoolCode = schoolName.substring(0, 3).toUpperCase();

    // Format day, month, and year to ensure they are two digits for day and month
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
    const formattedYear = year.toString(); // Assuming year is already a number

    // Combine all parts to create the application number
    const applicationNumber = `${schoolCode}${formattedDay}${formattedMonth}${formattedYear}${randomNumber}${appliedForClass}`;

    return applicationNumber;
}
export default generateApplicationNumber();
