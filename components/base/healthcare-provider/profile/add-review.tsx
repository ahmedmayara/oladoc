import React from "react";

import { getPatientByUserId } from "@/actions/auth";
import { getHealthCareProviderUserAndOpeningHoursAndAbsencesById } from "@/actions/healthcare-provider";
import { addNewReview } from "@/actions/review";
import { AddNewReviewSchema, AddNewReviewSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";
import {
  Absence,
  HealthCareProvider,
  OpeningHours,
  User,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const labels: { [index: string]: string } = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

type AddReviewProps = {
  healthcareProvider: Awaited<
    ReturnType<typeof getHealthCareProviderUserAndOpeningHoursAndAbsencesById>
  >;
  patient: Awaited<ReturnType<typeof getPatientByUserId>>;
};

export function AddReview({ healthcareProvider, patient }: AddReviewProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [isPending, startTransition] = React.useTransition();
  const [hover, setHover] = React.useState(-1);

  const addNewReviewForm = useForm<AddNewReviewSchemaType>({
    resolver: zodResolver(AddNewReviewSchema),
    defaultValues: {
      comment: "",
      rating: 3,
    },
  });

  const onSubmit = async (data: AddNewReviewSchemaType) => {
    startTransition(() => {
      addNewReview(healthcareProvider?.id || "", data).then(() => {
        addNewReviewForm.reset();
        setOpen(false);
        toast.success("Review added successfully!");
      });
    });
  };

  const patientHasAtLeastOneConsultationWithHealthcareProvider =
    healthcareProvider?.consultations?.some(
      (consultation) => consultation.patientId === patient?.id,
    );

  return (
    <div
      className={cn(
        !patientHasAtLeastOneConsultationWithHealthcareProvider &&
          "hidden opacity-0",
      )}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="blue" className="mt-3">
            Add review
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Add a review to Dr {healthcareProvider?.user.name}
            </DialogTitle>
            <DialogDescription>
              Your feedback helps others learn about your experience with the
              current healthcare provider.
            </DialogDescription>
          </DialogHeader>
          <Form {...addNewReviewForm}>
            <form
              className="grid gap-4 py-4"
              onSubmit={addNewReviewForm.handleSubmit(onSubmit)}
              id="add-review-form"
            >
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center gap-2">
                  <Rating
                    name="hover-feedback"
                    value={addNewReviewForm.watch("rating")}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                      addNewReviewForm.setValue("rating", newValue ?? 0);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                  {addNewReviewForm.watch("rating") !== null && (
                    <Label>
                      {
                        labels[
                          hover !== -1
                            ? hover
                            : addNewReviewForm.watch("rating")
                        ]
                      }
                    </Label>
                  )}
                </div>
              </div>
              <FormField
                control={addNewReviewForm.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Leave a comment..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button
              type="submit"
              form="add-review-form"
              variant="blue"
              disabled={isPending || !addNewReviewForm.formState.isDirty}
            >
              Add review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}