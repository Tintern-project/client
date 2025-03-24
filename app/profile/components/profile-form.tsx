import { FormInput } from "@/app/profile/components/ui/form-input";
import { FormSelect } from "@/app/profile/components/ui/form-select";
import { Button } from "@/app/profile/components/ui/button";

export default function ProfileForm() {
  return (
    <div className="space-y-10">
      <h1 className="text-5xl font-bold text-red-600">Hello, Kendall Roy</h1>

      <div className="space-y-8">
        <div>
          <label
            htmlFor="first-name"
            className="block text-lg font-medium mb-3"
          >
            Name
          </label>
          <div className="grid grid-cols-2 gap-6">
            <FormInput
              id="first-name"
              placeholder="John"
              defaultValue="John"
              aria-label="First name"
              className="h-14 text-lg rounded-lg"
            />
            <FormInput
              id="last-name"
              placeholder="Doe"
              defaultValue="Doe"
              aria-label="Last name"
              className="h-14 text-lg rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-3">
              Email
            </label>
            <FormInput
              id="email"
              placeholder="example@gmail.com"
              type="email"
              className="h-14 text-lg rounded-lg"
            />
          </div>

          <div>
            <label
              htmlFor="date-of-birth"
              className="block text-lg font-medium mb-3"
            >
              Date Of Birth
            </label>
            <FormSelect id="date-of-birth" className="h-14 text-lg rounded-lg">
              <option>Add / Update preexisting One</option>
              <option>January 1, 1990</option>
              <option>January 1, 1991</option>
              <option>January 1, 1992</option>
            </FormSelect>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 items-end">
          <div>
            <label
              htmlFor="cv-select"
              className="block text-lg font-medium mb-3"
            >
              CV
            </label>
            <FormSelect id="cv-select" className="h-14 text-lg rounded-lg">
              <option>Choose From Uploaded Ones</option>
              <option>resume_2023.pdf</option>
              <option>cv_latest.pdf</option>
            </FormSelect>
          </div>

          <div>
            <Button
              variant="secondary"
              className="bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-lg w-full"
            >
              Upload a CV
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-lg">
          Update
        </Button>
      </div>
    </div>
  );
}
