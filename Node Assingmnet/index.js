const readline = require('readline');
const moment = require('moment');

// Function to calculate target excluding Fridays
function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
    const start = moment(startDate);
    const end = moment(endDate);

    if (start.isAfter(end)) {
        throw new Error('Start date must be before or equal to the end date');
    }

    const result = {
        daysExcludingFridays: [],
        daysWorkedExcludingFridays: [],
        monthlyTargets: [],
        totalTarget: 0
    };

    let current = start.clone().startOf('month');
    while (current.isBefore(end) || current.isSame(end, 'month')) {
        const month = current.format('YYYY-MM');
        const totalDaysExcludingFridays = countWorkingDaysExcludingFridays(current.clone().startOf('month'), current.clone().endOf('month'));

        const startOfMonth = current.clone().startOf('month');
        const endOfMonth = current.clone().endOf('month');

        const actualStart = moment.max(startOfMonth, start);
        const actualEnd = moment.min(endOfMonth, end);

        const daysWorkedExcludingFridays = countWorkingDaysExcludingFridays(actualStart, actualEnd);
        const monthlyTarget = (daysWorkedExcludingFridays / 365) * totalAnnualTarget;

        result.daysExcludingFridays.push(totalDaysExcludingFridays);
        result.daysWorkedExcludingFridays.push(daysWorkedExcludingFridays);
        result.monthlyTargets.push(monthlyTarget);
        result.totalTarget += monthlyTarget;

        current.add(1, 'month');
    }

    return result;
}

// Helper function to count working days excluding Fridays
function countWorkingDaysExcludingFridays(startDate, endDate) {
    let count = 0;
    let currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
        const dayOfWeek = currentDate.day();
        if (dayOfWeek !== 5) { // Exclude Fridays (5)
            count++;
        }
        currentDate.add(1, 'day');
    }

    return count;
}

// Setting up readline for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for input
rl.question('Enter the start date (YYYY-MM-DD): ', (startDate) => {
    rl.question('Enter the end date (YYYY-MM-DD): ', (endDate) => {
        rl.question('Enter the total annual target: ', (totalAnnualTarget) => {
            // Convert totalAnnualTarget to a number
            totalAnnualTarget = parseFloat(totalAnnualTarget);

            try {
                // Call the calculation function and display the result
                const result = calculateTotalTarget(startDate, endDate, totalAnnualTarget);
                console.log('Result:', result);
            } catch (error) {
                console.error('Error:', error.message);
            }

            // Close the readline interface
            rl.close();
        });
    });
});