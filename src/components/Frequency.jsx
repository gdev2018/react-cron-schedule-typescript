import React, { useEffect, useState } from "react";
import Select from "react-select";

import css from "./Frequency.module.css";
import {
  END_TYPES,
  MONTHS,
  MONTH_OPTIONS,
  REPEAT_OPTIONS,
} from "../utils/constants";
import { getDaysInMonth } from "../utils/dateUtils";
import { getRepeatFromFreqType } from "../utils/utils";

import i18n from "../i18n";

const repeatOptions = [
  { value: REPEAT_OPTIONS.WEEKLY, label: REPEAT_OPTIONS.WEEKLY },
  { value: REPEAT_OPTIONS.BI_WEEKLY, label: REPEAT_OPTIONS.BI_WEEKLY },
  { value: REPEAT_OPTIONS.MONTHLY, label: REPEAT_OPTIONS.MONTHLY },
  { value: REPEAT_OPTIONS.BI_MONTHLY, label: REPEAT_OPTIONS.BI_MONTHLY },
  { value: REPEAT_OPTIONS.QUARTERLY, label: REPEAT_OPTIONS.QUARTERLY },
  { value: REPEAT_OPTIONS.SEMI_ANNUAL, label: REPEAT_OPTIONS.SEMI_ANNUAL },
  { value: REPEAT_OPTIONS.YEARLY, label: REPEAT_OPTIONS.YEARLY },
];

const freqCountMap = {
  [REPEAT_OPTIONS.WEEKLY]: 1,
  [REPEAT_OPTIONS.BI_WEEKLY]: 2,
  [REPEAT_OPTIONS.MONTHLY]: 1,
  [REPEAT_OPTIONS.BI_MONTHLY]: 2,
  [REPEAT_OPTIONS.QUARTERLY]: 3,
  [REPEAT_OPTIONS.SEMI_ANNUAL]: 6,
  [REPEAT_OPTIONS.YEARLY]: 1,
};

const FreqCountDefinedTypes = [
  REPEAT_OPTIONS.BI_WEEKLY,
  REPEAT_OPTIONS.BI_MONTHLY,
  REPEAT_OPTIONS.QUARTERLY,
  REPEAT_OPTIONS.SEMI_ANNUAL,
];

function Frequency(props) {
  const {
    disabled = false,
    styles = {},
    setValue,
    state = {},
    setState,
  } = props;
  const {
    months,
    repeat,
    frequency,
    frequencyType,
    isFullWeek,
    selectedMonthDate,
    monthOption,
  } = state;
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);

  useEffect(() => {
    const selMonths = months.map((m) => {
      return { value: m, label: MONTHS[m] };
    });
    setSelectedMonths(selMonths);
    const options = MONTHS.map((m, index) => {
      return { value: index, label: m };
    });
    setMonthOptions(options);
  }, [months]);

  const handleRepeatClick = (event) => {
    const freqType = event?.target?.value;
    setValue({
      repeat: getRepeatFromFreqType(freqType),
      frequency: freqCountMap[freqType],
      repeatFor: undefined,
      repeatForType: undefined,
      isRepeatForDisabled: true,
      skipFrom: undefined,
      skipTo: undefined,
      isFullWeek: [REPEAT_OPTIONS.WEEKLY, REPEAT_OPTIONS.BI_WEEKLY].includes(
        freqType,
      )
        ? false
        : isFullWeek,
      isAdditionalOptionsActive: false,
      selectedEndType: END_TYPES.NO_END,
    });
    setState({ frequencyType: freqType });
    if (
      freqType === REPEAT_OPTIONS.YEARLY &&
      monthOption === MONTH_OPTIONS.STANDARD
    ) {
      const maxDayInMonth = getDaysInMonth(months);
      if (selectedMonthDate > maxDayInMonth) {
        setState({ selectedMonthDate: maxDayInMonth });
      }
    }
  };

  const handleFrequencyChange = (event) => {
    setValue({ frequency: Number(event?.target?.value) });
  };

  const handleMonthChange = (event) => {
    if (event?.length === 0) return;
    const val = event?.map((m) => Number(m?.value));
    setValue({ months: val });
    if (
      repeat === REPEAT_OPTIONS.YEARLY &&
      monthOption === MONTH_OPTIONS.STANDARD
    ) {
      const maxDayInMonth = getDaysInMonth(val);
      if (selectedMonthDate > maxDayInMonth) {
        setState({ selectedMonthDate: maxDayInMonth });
      }
    }
  };

  return (
    <div className={css.mainContainer} style={styles.frequencyContainer}>
      <div>
        <label className={css.repeatLabel} style={styles.repeatLabel}>
          {i18n.t("repeat")}
        </label>
        <select
          key="repeat"
          style={styles.repeatDropdown}
          disabled={disabled}
          value={frequencyType}
          className={css.repeatDropdown}
          name="repeat"
          id="repeat"
          onChange={handleRepeatClick}
        >
          {repeatOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className={css.frequencyContainer} style={styles.frequencyContainer}>
        {!FreqCountDefinedTypes.includes(frequencyType) && (
          <label className={css.everyLabel} style={styles.everyLabel}>
            {i18n.t("every")}
          </label>
        )}
        {repeat === REPEAT_OPTIONS.YEARLY && (
          <Select
            isDisabled={disabled}
            value={selectedMonths}
            onChange={handleMonthChange}
            isMulti
            name="months"
            options={monthOptions}
            required
            closeMenuOnSelect={false}
            isClearable={false}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                maxWidth: 300,
                border: "none",
                borderBottom: "1px dotted",
                borderRadius: 0,
                marginTop: -10,
              }),
            }}
          />
        )}
        {repeat !== REPEAT_OPTIONS.YEARLY &&
          !FreqCountDefinedTypes.includes(frequencyType) && (
            <>
              <input
                style={styles.frequencyInput}
                disabled={disabled}
                className={css.frequencyInput}
                value={frequency}
                onChange={handleFrequencyChange}
                type="number"
                min={1}
              />
              <label
                className={css.selectedRepeatlLabel}
                style={styles.selectedRepeatlLabel}
              >
                {repeat === i18n.t("yearly") ? i18n.t("year") : null}
                {repeat === i18n.t("monthly") ? i18n.t("months") : null}
                {repeat === i18n.t("weekly") ? i18n.t("weeks") : null}
              </label>
            </>
          )}
      </div>
    </div>
  );
}

export default Frequency;
