"use client"

import React, { useEffect, useState } from "react";
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ar } from "date-fns/locale"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [timeSlot, setTimeSlot] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  useEffect(() => {
    if (!date) return

    const fetchSlots = async () => {
      const formatted = format(date, "yyyy-MM-dd")
      try {
        const res = await fetch(`http://localhost:8000/available-slots/?date=${formatted}`)
        const data = await res.json()
        setAvailableSlots(data.available_slots)
      } catch (err) {
        toast.error("تعذر جلب الأوقات المتاحة")
        setAvailableSlots([])
      }
    }

    fetchSlots()
  }, [date])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // تحقق بسيط من الحقول
    if (!date) {
      toast.error("يرجى اختيار تاريخ")
      return
    }
    if (!timeSlot) {
      toast.warning("يرجى اختيار موعد")
      return
    }
    if (!name.trim() || !email.trim()) {
      toast.error("الاسم والإيميل مطلوبين")
      return
    }

    setIsLoading(true)

    const formattedDate = format(date, "yyyy-MM-dd")

    try {
      const response = await fetch("http://localhost:8000/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: formattedDate,
          time_slot: timeSlot,
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في حفظ الحجز")
      }

      toast.success("تم الحجز بنجاح!", {
        description: `موعدك في ${formattedDate} الساعة ${timeSlot}`,
      })

      // reset النموذج
      setName("")
      setEmail("")
      setPhone("")
      setTimeSlot("")
      // يمكنك إعادة تعيين التاريخ أو تركه كما هو
      // setDate(undefined)

    } catch (error) {
      console.error(error)
      toast.error("حدث خطأ أثناء الحجز", {
        description: "حاول مرة أخرى أو تواصل مع الدعم",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-4xl font-bold mb-10 text-center">احجز موعدك الآن</h1>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* التقويم */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">اختر التاريخ</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date() || d > new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
              className="rounded-md border shadow-sm"
              locale={ar}
            />
          </CardContent>
        </Card>

        {/* نموذج الحجز */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">
              {date
                ? `موعد في ${format(date, "dd MMMM yyyy", { locale: ar })}`
                : "اختر تاريخ أولاً"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right block">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="text-right"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01234567890"
                />
              </div>

              <div className="space-y-2">
                <Label>الوقت المتاح</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot} required>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر موعدًا متاحًا" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-6"
                disabled={isLoading || !date || !timeSlot}
              >
                {isLoading ? "جاري الحجز..." : "تأكيد الحجز"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}