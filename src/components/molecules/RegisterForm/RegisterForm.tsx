"use client"

import {
  FieldError,
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form"
import { Button } from "@/components/atoms"
import { zodResolver } from "@hookform/resolvers/zod"
import { LabeledInput } from "@/components/cells"
import { registerFormSchema, RegisterFormData } from "./schema"
import { signup } from "@/lib/data/customer"
import { useState } from "react"
import { Container } from "@medusajs/ui"
import Link from "next/link"
import { PasswordValidator } from "@/components/cells/PasswordValidator/PasswordValidator"
import { WorkOSLoginButton } from "@/components/cells/WorkOSLoginButton"
import { toast } from "@/lib/helpers/toast"
import { useSearchParams, useRouter } from "next/navigation"
import posthog from "posthog-js"

export const RegisterForm = () => {
  const searchParams = useSearchParams()
  const isBusiness = searchParams.get("type") === "business"

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      companyName: "",
    },
  })

  return (
    <FormProvider {...methods}>
      <Form isBusiness={isBusiness} />
    </FormProvider>
  )
}

const Form = ({ isBusiness }: { isBusiness: boolean }) => {
  const [passwordError, setPasswordError] = useState({
    isValid: false,
    lower: false,
    upper: false,
    "8chars": false,
    symbolOrDigit: false,
  })

  const router = useRouter()

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<RegisterFormData>()

  const submit = async (data: RegisterFormData) => {
    if (!passwordError.isValid) {
      return
    }

    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("first_name", data.firstName)
    formData.append("last_name", data.lastName)
    formData.append("phone", data.phone)

    if (isBusiness && data.companyName) {
      formData.append("company_name", data.companyName)
    }

    const res = await signup(formData)

    if (res && !res?.id) {
      const errorMessage = res.toLowerCase().includes('error: identity with email already exists')
        ? 'It seems the email you entered is already associated with another account. Please log in instead.'
        : res
      toast.error({ title: errorMessage })
    } else if (res?.id) {
      posthog.identify(data.email, {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        account_type: isBusiness ? 'business' : 'personal',
      })
      posthog.capture('user_registered', {
        email: data.email,
        account_type: isBusiness ? 'business' : 'personal',
      })
      router.push('/user')
    }
  }

  return (
    <main className="container" data-testid="register-page">
      <Container className="border max-w-xl mx-auto mt-8 p-4" data-testid="register-form-container">
        <h1 className="heading-md text-primary uppercase mb-8">
          {isBusiness ? "Create business account" : "Create account"}
        </h1>
        <form onSubmit={handleSubmit(submit)} data-testid="register-form">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <LabeledInput
              className="md:w-1/2"
              label="First name"
              placeholder="Your first name"
              error={errors.firstName as FieldError}
              data-testid="register-first-name-input"
              {...register("firstName")}
            />
            <LabeledInput
              className="md:w-1/2"
              label="Last name"
              placeholder="Your last name"
              error={errors.lastName as FieldError}
              data-testid="register-last-name-input"
              {...register("lastName")}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <LabeledInput
              className="md:w-1/2"
              label="E-mail"
              placeholder="Your e-mail address"
              error={errors.email as FieldError}
              data-testid="register-email-input"
              {...register("email")}
            />
            <LabeledInput
              className="md:w-1/2"
              label="Phone"
              placeholder="Your phone number"
              error={errors.phone as FieldError}
              data-testid="register-phone-input"
              {...register("phone")}
            />
          </div>

          {isBusiness && (
            <div className="mb-4">
              <LabeledInput
                className="w-full"
                label="Company name"
                placeholder="Your company name"
                error={errors.companyName as FieldError}
                data-testid="register-company-name-input"
                {...register("companyName")}
              />
            </div>
          )}

          <div>
            <LabeledInput
              className="mb-4"
              label="Password"
              placeholder="Your password"
              type="password"
              error={errors.password as FieldError}
              data-testid="register-password-input"
              {...register("password")}
            />
            <PasswordValidator
              password={watch("password")}
              setError={setPasswordError}
            />
          </div>

          <Button
            className="w-full flex justify-center mt-8 uppercase"
            disabled={isSubmitting}
            loading={isSubmitting}
            data-testid="register-submit-button"
          >
            {isBusiness ? "Create business account" : "Create account"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-primary px-2 text-neutral-secondary">or</span>
            </div>
          </div>
          <WorkOSLoginButton />
        </div>

        <div className="mt-4 text-center">
          {isBusiness ? (
            <Link href="/register" className="text-sm text-action hover:underline">
              Register as a personal account instead
            </Link>
          ) : (
            <Link href="/register?type=business" className="text-sm text-action hover:underline">
              Register as a business account
            </Link>
          )}
        </div>
      </Container>
      <Container className="border max-w-xl mx-auto mt-8 p-4">
        <h2 className="heading-md text-primary uppercase mb-8">
          Already have an account?
        </h2>
        <Link href="/login" data-testid="register-login-link">
          <Button
            variant="tonal"
            className="w-full flex justify-center mt-8 uppercase"
          >
            Log in
          </Button>
        </Link>
      </Container>
    </main>
  )
}
