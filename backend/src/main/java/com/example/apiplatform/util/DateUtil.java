package com.example.apiplatform.util;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class DateUtil {

    private static final DateTimeFormatter DAY_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    public static String currentDayKey() {
        return LocalDate.now(ZoneOffset.UTC).format(DAY_FORMAT);
    }

    public static String currentMonthKey() {
        return YearMonth.now(ZoneOffset.UTC).format(MONTH_FORMAT);
    }
}
