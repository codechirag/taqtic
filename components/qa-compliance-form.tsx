"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "../store/store"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, X, FileText, Upload, CalendarIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import {
  setBrandType,
  setSelectedBrand,
  setRestaurantName,
  setStoreId,
  setEmail,
  toggleSection,
  updateMetrics,
  setBrandProductType,
  setSelectedBrandProduct,
  setKfcProducts,
  setHardeesProducts,
  setTgifProducts,
  setKrispyKremeProducts,
  setPizzaHutProducts,
  setAcpProducts,
  setBrandSupplier,
  setProductionDate,
  setExpirationDate,
  setBatchNo,
  setAttachedPhotos,
  setDcWhPosition,
  setWhDcLocationName,
  setWhDcProductsDetails,
  setWhDcProductNameAsPerLabel,
  setWhDcProductCodeOnSystem,
  setWhDcProductionDate,
  setWhDcExpirationDate,
  setWhDcSupplierName,
  setWhDcContainerNumber,
  setWhDcArrivalDate,
  setWhDcArrivalTime,
  setWhDcTypeOfComplaint,
  setWhDcDescribeIssueInDetails,
  setWhDcInitialActionTakenByWh,
  toggleQuestionComment,
  setQuestionComment,
  toggleQuestionNA,
  setQuestionFiles,
  removeQuestionFile,
  setHasAttemptedSubmit,
} from "../store/qaComplianceSlice"
import { acpProductOptions, brandOptions, brandProductOptions, complaintTypeOptions, dcWhPositionOptions, hardeesProductOptions, kfcProductOptions, pizzaHutProductOptions, productTypeOptions, supplierOptions, tgifProductOptions } from "@/static"



function QAComplianceFormContent() {
  const dispatch = useAppDispatch()
  const {
    storeInfo,
    processMetrics,
    sections,
    overallCompletion,
    email,
    questionComments,
    questionNAStates,
    fileUploads,
    hasAttemptedSubmit,
  } = useAppSelector((state) => state.qaCompliance)
  const { restaurantDetails, brandNames, whDc, otherComplaintType } = sections

  useEffect(() => {
    dispatch(updateMetrics())
  }, [
    restaurantDetails.data.brandType,
    restaurantDetails.data.selectedBrand,
    restaurantDetails.data.restaurantName,
    restaurantDetails.data.storeId,
    dispatch,
  ])

  const handleBrandTypeSelect = (type: "Brand" | "WH DC") => {
    dispatch(setBrandType(type))
  }

  const handleBrandSelect = (brand: string) => {
    dispatch(setSelectedBrand(brand))
  }

  const handleToggleSection = (section: keyof typeof sections) => {
    dispatch(toggleSection(section))
  }

  const isFieldRequired = (value: string | null) => !value || value.trim() === ""

  const getQuestionComment = (questionId: string) => {
    return questionComments?.find((c) => c.questionId === questionId)
  }

  const getQuestionNAState = (questionId: string) => {
    return questionNAStates?.find((na) => na.questionId === questionId)?.isNA || false
  }

  const getQuestionFiles = (questionId: string) => {
    return fileUploads?.find((upload) => upload.questionId === questionId)?.files || []
  }

  const handleCommentToggle = (questionId: string) => {
    dispatch(toggleQuestionComment(questionId))
  }

  const handleCommentChange = (questionId: string, comment: string) => {
    dispatch(setQuestionComment({ questionId, comment }))
  }

  const handleNAToggle = (questionId: string) => {
    dispatch(toggleQuestionNA(questionId))
  }

  const handleFileUpload = (questionId: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      dispatch(setQuestionFiles({ questionId, files: fileArray }))
    }
  }

  const handleFileRemove = (questionId: string, fileIndex: number) => {
    dispatch(removeQuestionFile({ questionId, fileIndex }))
  }

  const handleSubmit = () => {
    dispatch(setHasAttemptedSubmit(true))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-slate-800">QA Compliance Process</h1>
                <p className="text-slate-600">UAE Market Quality Assurance</p>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                    <span className="mr-2">🏪</span>
                    {storeInfo.id} - {storeInfo.name}
                  </Badge>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="text-4xl font-bold text-blue-600">{overallCompletion.toFixed(1)}%</div>
                <p className="text-sm text-slate-500">Completion</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 p-6 bg-slate-50 rounded-xl">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-slate-700">{processMetrics.remainingMandatoryQs}</div>
                <p className="text-sm text-slate-500">Remaining Questions</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-slate-700">{processMetrics.processScore}</div>
                <p className="text-sm text-slate-500">Process Score</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-slate-700">{processMetrics.processCompliance}%</div>
                <p className="text-sm text-slate-500">Compliance</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Restaurant Details Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader
            className="cursor-pointer hover:bg-slate-50/80 transition-all duration-200 border-b border-slate-100"
            onClick={() => handleToggleSection("restaurantDetails")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Restaurant Details</h2>
                  <p className="text-sm text-slate-500">Information to be completed by restaurants</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="grid grid-cols-3 gap-8 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-slate-700">{restaurantDetails.metrics.sectionScore}</div>
                    <div className="text-slate-500">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-slate-700">{restaurantDetails.metrics.sectionCompliance}%</div>
                    <div className="text-slate-500">Compliance</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-slate-700">{restaurantDetails.metrics.remainingMandatoryQuestions}</div>
                    <div className="text-slate-500">Remaining</div>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-slate-100">
                  {restaurantDetails.isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600" /> : <ChevronDown className="h-5 w-5 text-slate-600" />}
                </div>
              </div>
            </div>
          </CardHeader>

          {restaurantDetails.isExpanded && (
            <CardContent className="p-8 space-y-10">
              {/* Question 1.1 - Brand Type */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-rose-100 text-rose-700 border-rose-200">1.1</Badge>
                    <div>
                      <h3 className="font-semibold text-slate-800">Brand Name / WH / DC</h3>
                      <p className="text-sm text-slate-500">Select your organization type</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    onClick={() => handleCommentToggle("1.1")}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant={restaurantDetails.data.brandType === "Brand" ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleBrandTypeSelect("Brand")}
                    className={`px-8 py-3 font-medium transition-all duration-200 ${restaurantDetails.data.brandType === "Brand"
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    Brand
                  </Button>
                  <Button
                    variant={restaurantDetails.data.brandType === "WH DC" ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleBrandTypeSelect("WH DC")}
                    className={`px-8 py-3 font-medium transition-all duration-200 ${restaurantDetails.data.brandType === "WH DC"
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    WH DC
                  </Button>
                </div>

                {hasAttemptedSubmit && isFieldRequired(restaurantDetails.data.brandType) && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <X className="h-4 w-4" />
                    <span className="text-sm font-medium">This field is required</span>
                  </div>
                )}

                {getQuestionComment("1.1")?.isVisible && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Add Comment</Label>
                    <Textarea
                      placeholder="Write your comment here..."
                      value={getQuestionComment("1.1")?.comment || ""}
                      onChange={(e) => handleCommentChange("1.1", e.target.value)}
                      className="bg-white border-slate-200"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Badge variant="outline" className="text-slate-500 border-slate-300">
                    🔘 Single Answer
                  </Badge>
                </div>
              </div>

              {/* Conditional Questions based on Brand Type */}
              {restaurantDetails.data.brandType === "Brand" && (
                <>
                  {/* Question 1.2 - Brands */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">1.2</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Brands</h3>
                        <p className="text-sm text-slate-500">Select your brand</p>
                      </div>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {brandOptions.map((brand) => (
                        <Button
                          key={brand}
                          variant={restaurantDetails.data.selectedBrand === brand ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleBrandSelect(brand)}
                          className={`p-3 h-auto text-sm font-medium transition-all duration-200 ${restaurantDetails.data.selectedBrand === brand
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                          {brand}
                        </Button>
                      ))}
                    </div>

                    {hasAttemptedSubmit && isFieldRequired(restaurantDetails.data.selectedBrand) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}
                  </div>

                  {/* Question 1.3 - Restaurant Name */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">1.3</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Restaurant Name</h3>
                        <p className="text-sm text-slate-500">Enter your restaurant name</p>
                      </div>
                    </div>

                    <Input
                      placeholder="Enter restaurant name"
                      value={restaurantDetails.data.restaurantName}
                      onChange={(e) => dispatch(setRestaurantName(e.target.value))}
                      className="max-w-md bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />

                    {hasAttemptedSubmit && isFieldRequired(restaurantDetails.data.restaurantName) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}
                  </div>

                  {/* Question 1.4 - Store ID */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">1.4</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Store ID</h3>
                        <p className="text-sm text-slate-500">Enter your store identification number</p>
                      </div>
                    </div>

                    <Input
                      placeholder="Enter store ID"
                      value={restaurantDetails.data.storeId}
                      onChange={(e) => dispatch(setStoreId(e.target.value))}
                      className="max-w-md bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />

                    {hasAttemptedSubmit && isFieldRequired(restaurantDetails.data.storeId) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {restaurantDetails.data.brandType === "WH DC" && (
                <>
                  {/* Question 1.9 - DC / WH Position */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">1.9</Badge>
                        <div>
                          <h3 className="font-semibold text-slate-800">DC / WH Position</h3>
                          <p className="text-sm text-slate-500">Select your position type</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                        onClick={() => handleCommentToggle("1.9")}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>

                    <Select
                      value={restaurantDetails.data.dcWhPosition}
                      onValueChange={(value) => dispatch(setDcWhPosition(value))}
                    >
                      <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {dcWhPositionOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {hasAttemptedSubmit && isFieldRequired(restaurantDetails.data.dcWhPosition) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-sm">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}

                    {getQuestionComment("1.9")?.isVisible && (
                      <div className="bg-slate-50 p-4 rounded-lg max-w-md">
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">Add Comment</Label>
                        <Textarea
                          placeholder="Write your comment here..."
                          value={getQuestionComment("1.9")?.comment || ""}
                          onChange={(e) => handleCommentChange("1.9", e.target.value)}
                          className="bg-white border-slate-200"
                        />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-slate-500 border-slate-300">
                        📋 Dropdown
                      </Badge>
                    </div>
                  </div>

                  {/* Question 1.10 - WH/DC location or Name */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">1.10</Badge>
                        <div>
                          <h3 className="font-semibold text-slate-800">WH/DC Location or Name</h3>
                          <p className="text-sm text-slate-500">Enter location or facility name</p>
                        </div>

                      </div>
                      <Button
                        variant={getQuestionNAState("1.10") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("1.10")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("1.10")}
                      >
                        N/A
                      </Button>
                    </div>

                    <Input
                      placeholder="Enter location or name"
                      value={restaurantDetails.data.whDcLocationName}
                      onChange={(e) => dispatch(setWhDcLocationName(e.target.value))}
                      className="max-w-md bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      disabled={getQuestionNAState("1.10")}
                    />

                    {!getQuestionNAState("1.10") &&
                      hasAttemptedSubmit &&
                      isFieldRequired(restaurantDetails.data.whDcLocationName) && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                          <X className="h-4 w-4" />
                          <span className="text-sm font-medium">This field is required</span>
                        </div>
                      )}

                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-slate-500 border-slate-300">
                        📝 Short answer
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>

        {restaurantDetails.data.brandType === "WH DC" && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-slate-50/80 transition-all duration-200 border-b border-slate-100"
              onClick={() => handleToggleSection("whDc")}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">WH/DC Details</h2>
                    <p className="text-sm text-slate-500">Information specific to WH/DC operations</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="grid grid-cols-3 gap-8 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-slate-700">{whDc.metrics.sectionScore}</div>
                      <div className="text-slate-500">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-700">{whDc.metrics.sectionCompliance}%</div>
                      <div className="text-slate-500">Compliance</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-700">{whDc.metrics.remainingMandatoryQuestions}</div>
                      <div className="text-slate-500">Remaining</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-slate-100">
                    {whDc.isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600" /> : <ChevronDown className="h-5 w-5 text-slate-600" />}
                  </div>
                </div>
              </div>
            </CardHeader>

            {whDc.isExpanded && (
              <CardContent className="p-8 space-y-10">
                {/* Question 2.1 - Products details */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.1</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Products Details</h3>
                        <p className="text-sm text-slate-500">Provide details about the products</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.1") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.1")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.1")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.1")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.1"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.1", e.target.files)}
                      />
                    </div>
                  </div>

                  <Input
                    placeholder="Enter product details"
                    value={whDc.data.productsDetails}
                    onChange={(e) => dispatch(setWhDcProductsDetails(e.target.value))}
                    className="max-w-md bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.productsDetails) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  {/* File Preview */}
                  {getQuestionFiles("2.1").length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {getQuestionFiles("2.1").map((file, index) => (
                        <div key={index} className="relative">
                          <div className="w-20 h-20 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="h-10 w-10 text-slate-400" />
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-red-500 text-white hover:bg-red-600 p-0 shadow-md"
                            onClick={() => handleFileRemove("2.1", index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📝 Short answer
                    </Badge>
                  </div>
                </div>

                {/* Question 2.2 - Product name as per label */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.2</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Product Name as per Label</h3>
                        <p className="text-sm text-slate-500">Enter the product name as it appears on the label</p>
                      </div>

                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.2") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.2")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.2")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.2")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.2"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.2", e.target.files)}
                      />
                    </div>
                  </div>

                  <Input
                    placeholder="Enter product name as per label"
                    value={whDc.data.productNameAsPerLabel}
                    onChange={(e) => dispatch(setWhDcProductNameAsPerLabel(e.target.value))}
                    className="max-w-md bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.productNameAsPerLabel) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📝 Short answer
                    </Badge>
                  </div>
                </div>

                {/* Question 2.3 - Product Code on the system */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.3</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Product Code on the System</h3>
                        <p className="text-sm text-slate-500">Enter the product code as it appears in the system</p>
                      </div>

                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.3") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.3")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.3")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.3")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.3"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.3", e.target.files)}
                      />
                    </div>
                  </div>

                  <Input
                    placeholder="Enter product code"
                    value={whDc.data.productCodeOnSystem}
                    onChange={(e) => dispatch(setWhDcProductCodeOnSystem(e.target.value))}
                    className="max-w-md bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.productCodeOnSystem) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📝 Short answer
                    </Badge>
                  </div>
                </div>

                {/* Question 2.4 - Production date */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.4</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Production Date</h3>
                        <p className="text-sm text-slate-500">Select the production date</p>
                      </div>

                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.4") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.4")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.4")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.4")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.4"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.4", e.target.files)}
                      />
                    </div>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="max-w-sm justify-start text-left font-normal bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {whDc.data.productionDate ? (
                          format(new Date(whDc.data.productionDate), "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-lg">
                      <Calendar
                        mode="single"
                        selected={whDc.data.productionDate ? new Date(whDc.data.productionDate) : undefined}
                        onSelect={(date) => dispatch(setWhDcProductionDate(date ? date.toISOString() : ""))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.productionDate) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📅 Date
                    </Badge>
                  </div>
                </div>

                {/* Question 2.5 - Expiration date */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.5</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Expiration Date</h3>
                        <p className="text-sm text-slate-500">Select the expiration date</p>
                      </div>

                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.5") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.5")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.5")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.5")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.5"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.5", e.target.files)}
                      />
                    </div>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="max-w-sm justify-start text-left font-normal bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {whDc.data.expirationDate ? (
                          format(new Date(whDc.data.expirationDate), "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-lg">
                      <Calendar
                        mode="single"
                        selected={whDc.data.expirationDate ? new Date(whDc.data.expirationDate) : undefined}
                        onSelect={(date) => dispatch(setWhDcExpirationDate(date ? date.toISOString() : ""))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.expirationDate) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📅 Date
                    </Badge>
                  </div>
                </div>

                {/* Question 2.6 - Supplier Name */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.6</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Supplier Name</h3>
                        <p className="text-sm text-slate-500">Enter the name of the supplier</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.6") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.6")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.6")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.6")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.6"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.6", e.target.files)}
                      />
                    </div>
                  </div>

                  <Input
                    placeholder="Enter supplier name"
                    value={whDc.data.supplierName}
                    onChange={(e) => dispatch(setWhDcSupplierName(e.target.value))}
                    className="max-w-md bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.supplierName) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📝 Short answer
                    </Badge>
                  </div>
                </div>

                {/* Question 2.7 - Container number */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.7</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Container Number</h3>
                        <p className="text-sm text-slate-500">Enter the container number</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.7") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.7")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.7")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.7")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.7"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.7", e.target.files)}
                      />
                    </div>
                  </div>

                  <Input
                    placeholder="Enter container number"
                    value={whDc.data.containerNumber}
                    onChange={(e) => dispatch(setWhDcContainerNumber(e.target.value))}
                    className="max-w-md bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.containerNumber) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📝 Short answer
                    </Badge>
                  </div>
                </div>

                {/* Question 2.8 - Arrival date */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.8</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Arrival Date</h3>
                        <p className="text-sm text-slate-500">Select the arrival date</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.8") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.8")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.8")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.8")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.8"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.8", e.target.files)}
                      />
                    </div>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="max-w-sm justify-start text-left font-normal bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {whDc.data.arrivalDate ? (
                          format(new Date(whDc.data.arrivalDate), "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-lg">
                      <Calendar
                        mode="single"
                        selected={whDc.data.arrivalDate ? new Date(whDc.data.arrivalDate) : undefined}
                        onSelect={(date) => dispatch(setWhDcArrivalDate(date ? date.toISOString() : ""))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.arrivalDate) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📅 Date
                    </Badge>
                  </div>
                </div>

                {/* Question 2.9 - Arrival time */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.9</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Arrival Time</h3>
                        <p className="text-sm text-slate-500">Select the arrival time</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.9") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.9")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.9")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.9")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.9"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.9", e.target.files)}
                      />
                    </div>
                  </div>

                  <Input
                    type="time"
                    value={whDc.data.arrivalTime}
                    onChange={(e) => dispatch(setWhDcArrivalTime(e.target.value))}
                    className="max-w-xs bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.arrivalTime) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      🕐 Time
                    </Badge>
                  </div>
                </div>

                {/* Question 2.10 - Type of Complaint */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.10</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Type of Complaint</h3>
                        <p className="text-sm text-slate-500">Select the type of complaint</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.10") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.10")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.10")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.10")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.10"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.10", e.target.files)}
                      />
                    </div>
                  </div>

                  <Select
                    value={whDc.data.typeOfComplaint}
                    onValueChange={(value) => dispatch(setWhDcTypeOfComplaint(value))}
                  >
                    <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select complaint type" />
                    </SelectTrigger>
                    <SelectContent>
                      {complaintTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.typeOfComplaint) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📋 Dropdown
                    </Badge>
                  </div>
                </div>

                {/* Question 2.11 - Describe the issue in details */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.11</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Describe the Issue in Details</h3>
                        <p className="text-sm text-slate-500">Provide a detailed description of the issue</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.11") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.11")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.11")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.11")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.11"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.11", e.target.files)}
                      />
                    </div>
                  </div>

                  <Textarea
                    placeholder="Enter a detailed description of the issue"
                    value={whDc.data.describeIssueInDetails}
                    onChange={(e) => dispatch(setWhDcDescribeIssueInDetails(e.target.value))}
                    className="max-w-md min-h-[120px] bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.describeIssueInDetails) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📝 Short answer
                    </Badge>
                  </div>
                </div>

                {/* Question 2.12 - Initial Action Taken by WH */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">2.12</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Initial Action Taken by WH</h3>
                        <p className="text-sm text-slate-500">Describe the initial action taken by the warehouse</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant={getQuestionNAState("2.12") ? "default" : "outline"}
                        size="sm"
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${getQuestionNAState("2.12")
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                          }`}
                        onClick={() => handleNAToggle("2.12")}
                      >
                        N/A
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => document.getElementById("file-upload-2.12")?.click()}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <input
                        id="file-upload-2.12"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("2.12", e.target.files)}
                      />
                    </div>
                  </div>

                  <Textarea
                    placeholder="Enter a description of the initial action taken"
                    value={whDc.data.initialActionTakenByWh}
                    onChange={(e) => dispatch(setWhDcInitialActionTakenByWh(e.target.value))}
                    className="max-w-md min-h-[120px] bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  {hasAttemptedSubmit && isFieldRequired(whDc.data.initialActionTakenByWh) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📝 Short answer
                    </Badge>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {restaurantDetails.data.brandType === "Brand" && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-slate-50/80 transition-all duration-200 border-b border-slate-100"
              onClick={() => handleToggleSection("brandNames")}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">Brand Names</h2>
                    <p className="text-sm text-slate-500">Information specific to brand names</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="grid grid-cols-3 gap-8 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-slate-700">{brandNames.metrics.sectionScore}</div>
                      <div className="text-slate-500">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-700">{brandNames.metrics.sectionCompliance}%</div>
                      <div className="text-slate-500">Compliance</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-700">{brandNames.metrics.remainingMandatoryQuestions}</div>
                      <div className="text-slate-500">Remaining</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-slate-100">
                    {brandNames.isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600" /> : <ChevronDown className="h-5 w-5 text-slate-600" />}
                  </div>
                </div>
              </div>
            </CardHeader>

            {brandNames.isExpanded && (
              <CardContent className="p-8 space-y-10">
                {/* Question 3.1 - Product Type */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.1</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Product Type</h3>
                        <p className="text-sm text-slate-500">Choose from the dropdown lists</p>
                      </div>
                    </div>
                  </div>

                  <Select
                    value={brandNames.data.productType}
                    onValueChange={(value) => dispatch(setBrandProductType(value))}
                  >
                    <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasAttemptedSubmit && isFieldRequired(brandNames.data.productType) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📋 Dropdown
                    </Badge>
                  </div>
                </div>

                {/* Question 3.2 - Select Brand Product List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.2</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Select Brand Product List</h3>
                        <p className="text-sm text-slate-500">Select Brand product list</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {brandProductOptions.map((brand) => (
                      <Button
                        key={brand}
                        variant={brandNames.data.selectedBrandProduct === brand ? "default" : "outline"}
                        size="sm"
                        onClick={() => dispatch(setSelectedBrandProduct(brand))}
                        className={`p-3 h-auto text-sm font-medium transition-all duration-200 ${brandNames.data.selectedBrandProduct === brand
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        {brand}
                      </Button>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      🔘 Single Answer
                    </Badge>
                  </div>
                </div>

                {/* Conditional Brand Product Questions 3.3 - 3.8 */}
                {brandNames.data.selectedBrandProduct === "KFC" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.3</Badge>
                        <div>
                          <h3 className="font-semibold text-slate-800">KFC Products</h3>
                          <p className="text-sm text-slate-500">Choose from the dropdown lists</p>
                        </div>
                      </div>
                    </div>

                    <Select
                      value={brandNames.data.kfcProducts}
                      onValueChange={(value) => dispatch(setKfcProducts(value))}
                    >
                      <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select KFC product" />
                      </SelectTrigger>
                      <SelectContent>
                        {kfcProductOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {hasAttemptedSubmit && isFieldRequired(brandNames.data.kfcProducts) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-slate-500 border-slate-300">
                        📋 Dropdown
                      </Badge>
                    </div>
                  </div>
                )}

                {brandNames.data.selectedBrandProduct === "Hardees" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.4</Badge>
                        <div>
                          <h3 className="font-semibold text-slate-800">Hardees Products</h3>
                          <p className="text-sm text-slate-500">Choose from the dropdown lists</p>
                        </div>
                      </div>
                    </div>

                    <Select
                      value={brandNames.data.hardeesProducts}
                      onValueChange={(value) => dispatch(setHardeesProducts(value))}
                    >
                      <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select Hardees product" />
                      </SelectTrigger>
                      <SelectContent>
                        {hardeesProductOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {hasAttemptedSubmit && isFieldRequired(brandNames.data.hardeesProducts) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-slate-500 border-slate-300">
                        📋 Dropdown
                      </Badge>
                    </div>
                  </div>
                )}

                {brandNames.data.selectedBrandProduct === "TGIF" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.5</Badge>
                        <div>
                          <h3 className="font-semibold text-slate-800">TGIF Products</h3>
                          <p className="text-sm text-slate-500">Choose from the dropdown lists</p>
                        </div>
                      </div>
                    </div>

                    <Select
                      value={brandNames.data.tgifProducts}
                      onValueChange={(value) => dispatch(setTgifProducts(value))}
                    >
                      <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select TGIF product" />
                      </SelectTrigger>
                      <SelectContent>
                        {tgifProductOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {hasAttemptedSubmit && isFieldRequired(brandNames.data.tgifProducts) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-slate-500 border-slate-300">
                        📋 Dropdown
                      </Badge>
                    </div>
                  </div>
                )}

                {brandNames.data.selectedBrandProduct === "Krispy Kreme" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.6</Badge>
                        <div>
                          <h3 className="font-semibold text-slate-800">Krispy Kreme Products</h3>
                          <p className="text-sm text-slate-500">Choose from the dropdown lists</p>
                        </div>
                      </div>
                    </div>

                    <Select
                      value={brandNames.data.krispyKremeProducts}
                      onValueChange={(value) => dispatch(setKrispyKremeProducts(value))}
                    >
                      <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select Krispy Kreme product" />
                      </SelectTrigger>
                      <SelectContent>
                        {krispyKremeProductOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {hasAttemptedSubmit && isFieldRequired(brandNames.data.krispyKremeProducts) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-slate-500 border-slate-300">
                        📋 Dropdown
                      </Badge>
                    </div>
                  </div>
                )}

                {brandNames.data.selectedBrandProduct === "Pizza Hut" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.7</Badge>
                        <div>
                          <h3 className="font-semibold text-slate-800">Pizza Hut Products</h3>
                          <p className="text-sm text-slate-500">Choose from the dropdown lists</p>
                        </div>
                      </div>
                    </div>

                    <Select
                      value={brandNames.data.pizzaHutProducts}
                      onValueChange={(value) => dispatch(setPizzaHutProducts(value))}
                    >
                      <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select Pizza Hut product" />
                      </SelectTrigger>
                      <SelectContent>
                        {pizzaHutProductOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {hasAttemptedSubmit && isFieldRequired(brandNames.data.pizzaHutProducts) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-slate-500 border-slate-300">
                        📋 Dropdown
                      </Badge>
                    </div>
                  </div>
                )}

                {brandNames.data.selectedBrandProduct === "ACP" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.8</Badge>
                        <div>
                          <h3 className="font-semibold text-slate-800">ACP Products</h3>
                          <p className="text-sm text-slate-500">Choose from the dropdown lists</p>
                        </div>
                      </div>
                    </div>

                    <Select
                      value={brandNames.data.acpProducts}
                      onValueChange={(value) => dispatch(setAcpProducts(value))}
                    >
                      <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select ACP product" />
                      </SelectTrigger>
                      <SelectContent>
                        {acpProductOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {hasAttemptedSubmit && isFieldRequired(brandNames.data.acpProducts) && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">This field is required</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-slate-500 border-slate-300">
                        📋 Dropdown
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Question 3.9 - Supplier */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.9</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Supplier</h3>
                        <p className="text-sm text-slate-500">Select the supplier</p>
                      </div>
                    </div>
                  </div>

                  <Select value={brandNames.data.supplier} onValueChange={(value) => dispatch(setBrandSupplier(value))}>
                    <SelectTrigger className="max-w-sm bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplierOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasAttemptedSubmit && isFieldRequired(brandNames.data.supplier) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📋 Dropdown
                    </Badge>
                  </div>
                </div>

                {/* Question 3.10 - Production Date */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.10</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Production Date</h3>
                        <p className="text-sm text-slate-500">Select the production date</p>
                      </div>
                    </div>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="max-w-sm justify-start text-left font-normal bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {brandNames.data.productionDate ? (
                          format(new Date(brandNames.data.productionDate), "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-lg">
                      <Calendar
                        mode="single"
                        selected={brandNames.data.productionDate ? new Date(brandNames.data.productionDate) : undefined}
                        onSelect={(date) => dispatch(setProductionDate(date ? date.toISOString() : ""))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {hasAttemptedSubmit && isFieldRequired(brandNames.data.productionDate) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📅 Date
                    </Badge>
                  </div>
                </div>

                {/* Question 3.11 - Expiration Date */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.11</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Expiration Date</h3>
                        <p className="text-sm text-slate-500">Select the expiration date</p>
                      </div>
                    </div>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="max-w-sm justify-start text-left font-normal bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {brandNames.data.expirationDate ? (
                          format(new Date(brandNames.data.expirationDate), "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-lg">
                      <Calendar
                        mode="single"
                        selected={brandNames.data.expirationDate ? new Date(brandNames.data.expirationDate) : undefined}
                        onSelect={(date) => dispatch(setExpirationDate(date ? date.toISOString() : ""))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {hasAttemptedSubmit && isFieldRequired(brandNames.data.expirationDate) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📅 Date
                    </Badge>
                  </div>
                </div>

                {/* Question 3.12 - Batch No */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.12</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Batch No</h3>
                        <p className="text-sm text-slate-500">Enter the batch number</p>
                      </div>
                    </div>
                  </div>

                  <Input
                    placeholder="Enter batch number"
                    value={brandNames.data.batchNo}
                    onChange={(e) => dispatch(setBatchNo(e.target.value))}
                    className="max-w-md bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />

                  {hasAttemptedSubmit && isFieldRequired(brandNames.data.batchNo) && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📝 Short answer
                    </Badge>
                  </div>
                </div>

                {/* Question 3.13 - Attached Photo */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">3.13</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-800">Attached Photo of the product label</h3>
                        <p className="text-sm text-slate-500">Attach a photo of the product label</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 mb-3">Max File Allowed 5</div>

                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer" onClick={() => document.querySelector('input[type="file"]')?.click()}>
                    <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <p className="text-slate-600">Click or drag files to this area to upload</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        dispatch(setAttachedPhotos(files));
                      }}
                    />
                  </div>

                  {hasAttemptedSubmit && brandNames.data.attachedPhotos.length === 0 && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg max-w-md">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">This field is required</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-slate-500 border-slate-300">
                      📎 File Upload
                    </Badge>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Other Complaint Type Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader
            className="cursor-pointer hover:bg-slate-50/80 transition-all duration-200 border-b border-slate-100"
            onClick={() => handleToggleSection("otherComplaintType")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">7</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Other Complaint Type</h2>
                  <p className="text-sm text-slate-500">For all other complaint type just below question need to complete</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="grid grid-cols-3 gap-8 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-slate-700">{otherComplaintType.metrics.sectionScore}</div>
                    <div className="text-slate-500">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-slate-700">{otherComplaintType.metrics.sectionCompliance}%</div>
                    <div className="text-slate-500">Compliance</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-slate-700">{otherComplaintType.metrics.remainingMandatoryQuestions}</div>
                    <div className="text-slate-500">Remaining</div>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-slate-100">
                  {otherComplaintType.isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600" /> : <ChevronDown className="h-5 w-5 text-slate-600" />}
                </div>
              </div>
            </div>
          </CardHeader>

          {otherComplaintType.isExpanded && (
            <CardContent className="p-8">
              <p className="text-slate-500">Other complaint type section content will be added here...</p>
            </CardContent>
          )}
        </Card>

        {/* Enter Details Section - Fixed at bottom with better styling */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                    className="w-80 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <Button
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                onClick={handleSubmit}
                size="lg"
              >
                Proceed to Submit
              </Button>
            </div>
          </div>
        </div>

        {/* Add bottom padding to account for fixed footer */}
        <div className="h-32"></div>
      </div>
    </div>
  )
}

export default function QAComplianceForm() {
  return (
    <Provider store={store}>
      <QAComplianceFormContent />
    </Provider>
  )
}
