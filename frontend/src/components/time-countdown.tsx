"use client";
import React, { useEffect, useState } from "react";

const TimeCountdown = ({
    startDate,
    endDate,
}: {
    startDate: Date;
    endDate: Date;
}) => {
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const targetDate = new Date(endDate).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeRemaining({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                });
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeRemaining({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    return (
        <div className="flex items-center gap-2">
            <TimeCountdownItem label="Ngày" value={timeRemaining.days} />
            <TimeCountdownItem label="Giờ" value={timeRemaining.hours} />
            <TimeCountdownItem label="Phút" value={timeRemaining.minutes} />
            <TimeCountdownItem label="Giây" value={timeRemaining.seconds} />
        </div>
    );
};

const TimeCountdownItem = ({
    label,
    value,
}: {
    label: string;
    value: number;
}) => {
    return (
        <div className="flex flex-col items-center bg-gray-200 rounded-md p-4">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    );
};

export default TimeCountdown;
