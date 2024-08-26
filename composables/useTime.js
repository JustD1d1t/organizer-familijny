export const useTime = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    const formatDate = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
    }

    const getFirstDateOfCurrentMonth = computed(() => {
        return formatDate(new Date(currentYear, currentMonth - 1, 1))
    })

    const getLastDateOfMonth = computed(() => {
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
        const nextMonthFirstDate = new Date(currentYear, nextMonth - 1, 1)
        const lastDateOfMonth = new Date(nextMonthFirstDate.getTime() - 1)
        return formatDate(lastDateOfMonth)
    })

    const getFirstDayOfWeek = computed(() => {
        const firstDayOfWeek =
            currentDate.getDate() -
            currentDate.getDay() +
            (currentDate.getDay() === 0 ? -6 : 1)
        return formatDate(new Date(currentDate.setDate(firstDayOfWeek)))
    })

    const getLastDayOfWeek = computed(() => {
        const lastDayOfWeek = currentDate.getDate() - currentDate.getDay() + 7
        return formatDate(new Date(currentDate.setDate(lastDayOfWeek)))
    })

    const getFirstDateOfQuarter = computed(() => {
        const currentQuarter = Math.floor((currentMonth - 1) / 3) + 1
        const firstMonthOfQuarter = (currentQuarter - 1) * 3 + 1
        return formatDate(new Date(currentYear, firstMonthOfQuarter - 1, 1))
    })

    const getLastDateOfQuarter = computed(() => {
        const currentQuarter = Math.floor((currentMonth - 1) / 3) + 1
        const lastMonthOfQuarter = currentQuarter * 3
        const nextQuarterFirstDate = new Date(
            currentYear,
            lastMonthOfQuarter,
            1
        )
        const lastDateOfQuarter = new Date(nextQuarterFirstDate.getTime() - 1)
        return formatDate(lastDateOfQuarter)
    })

    return {
        formatDate,
        getFirstDateOfCurrentMonth,
        getLastDateOfMonth,
        getFirstDayOfWeek,
        getLastDayOfWeek,
        getFirstDateOfQuarter,
        getLastDateOfQuarter,
    }
}
