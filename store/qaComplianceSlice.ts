import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ProcessMetrics {
  remainingMandatoryQs: number
  processScore: number
  processCompliance: number
}

interface SectionMetrics {
  sectionScore: number
  sectionCompliance: number
  remainingMandatoryQuestions: number
}

interface RestaurantDetails {
  brandType: "Brand" | "WH DC" | null
  selectedBrand: string | null
  restaurantName: string
  storeId: string
  // WH/DC specific fields
  dcWhPosition: string
  whDcLocationName: string
}

interface BrandNames {
  productType: string
  selectedBrandProduct: string
  kfcProducts: string // 3.3
  hardeesProducts: string // 3.4
  tgifProducts: string // 3.5
  krispyKremeProducts: string // 3.6
  pizzaHutProducts: string // 3.7
  acpProducts: string // 3.8
  supplier: string
  productionDate: string
  expirationDate: string
  batchNo: string
  attachedPhotos: File[]
}

type OtherComplaintType = {}

interface WhDcSection {
  productsDetails: string // 2.1
  productNameAsPerLabel: string // 2.2
  productCodeOnSystem: string // 2.3
  productionDate: string // 2.4
  expirationDate: string // 2.5
  supplierName: string // 2.6
  containerNumber: string // 2.7
  arrivalDate: string // 2.8
  arrivalTime: string // 2.9
  typeOfComplaint: string // 2.10
  describeIssueInDetails: string // 2.11
  initialActionTakenByWh: string // 2.12
}

interface QuestionComment {
  questionId: string
  comment: string
  isVisible: boolean
}

interface QuestionNAState {
  questionId: string
  isNA: boolean
}

interface FileUpload {
  questionId: string
  files: File[]
}

interface QAComplianceState {
  storeInfo: {
    id: string
    name: string
  }
  processMetrics: ProcessMetrics
  sections: {
    restaurantDetails: {
      metrics: SectionMetrics & { remainingMandatoryQuestions: number }
      data: RestaurantDetails
      isExpanded: boolean
    }
    brandNames: {
      metrics: SectionMetrics & { remainingMandatoryQuestions: 12 }
      data: BrandNames
      isExpanded: boolean
    }
    whDc: {
      metrics: SectionMetrics & { remainingMandatoryQuestions: 12 }
      data: {
        productsDetails: string
        productNameAsPerLabel: string
        productCodeOnSystem: string
        productionDate: string
        expirationDate: string
        supplierName: string
        containerNumber: string
        arrivalDate: string
        arrivalTime: string
        typeOfComplaint: string
        describeIssueInDetails: string
        initialActionTakenByWh: string
      }
      isExpanded: boolean
    }
    otherComplaintType: {
      metrics: SectionMetrics & { remainingMandatoryQuestions: 2 }
      data: OtherComplaintType
      isExpanded: boolean
    }
  }
  overallCompletion: number
  email: string
  questionComments: QuestionComment[]
  questionNAStates: QuestionNAState[]
  fileUploads: FileUpload[]
  hasAttemptedSubmit: false // Add this new field
}

const initialState: QAComplianceState = {
  storeInfo: {
    id: "32002",
    name: "Delhi Store",
  },
  processMetrics: {
    remainingMandatoryQs: 20,
    processScore: 0,
    processCompliance: 100.0,
  },
  sections: {
    restaurantDetails: {
      metrics: {
        sectionScore: 0,
        sectionCompliance: 100.0,
        remainingMandatoryQuestions: 7, // Will be dynamic based on brandType
      },
      data: {
        brandType: null,
        selectedBrand: null,
        restaurantName: "",
        storeId: "",
        dcWhPosition: "",
        whDcLocationName: "",
      },
      isExpanded: true,
    },
    brandNames: {
      metrics: {
        sectionScore: 0,
        sectionCompliance: 100.0,
        remainingMandatoryQuestions: 12,
      },
      data: {
        productType: "",
        selectedBrandProduct: "",
        kfcProducts: "",
        hardeesProducts: "",
        tgifProducts: "",
        krispyKremeProducts: "",
        pizzaHutProducts: "",
        acpProducts: "",
        supplier: "",
        productionDate: "",
        expirationDate: "",
        batchNo: "",
        attachedPhotos: [],
      },
      isExpanded: false,
    },
    whDc: {
      metrics: {
        sectionScore: 0,
        sectionCompliance: 100.0,
        remainingMandatoryQuestions: 12,
      },
      data: {
        productsDetails: "",
        productNameAsPerLabel: "",
        productCodeOnSystem: "",
        productionDate: "",
        expirationDate: "",
        supplierName: "",
        containerNumber: "",
        arrivalDate: "",
        arrivalTime: "",
        typeOfComplaint: "",
        describeIssueInDetails: "",
        initialActionTakenByWh: "",
      },
      isExpanded: false,
    },
    otherComplaintType: {
      metrics: {
        sectionScore: 0,
        sectionCompliance: 100.0,
        remainingMandatoryQuestions: 2,
      },
      data: {},
      isExpanded: false,
    },
  },
  overallCompletion: 4.8,
  email: "",
  questionComments: [],
  questionNAStates: [],
  fileUploads: [],
  hasAttemptedSubmit: false, // Add this new field
}

// Add new action reducers
const qaComplianceSlice = createSlice({
  name: "qaCompliance",
  initialState,
  reducers: {
    setBrandType: (state, action: PayloadAction<"Brand" | "WH DC">) => {
      state.sections.restaurantDetails.data.brandType = action.payload
    },
    setSelectedBrand: (state, action: PayloadAction<string>) => {
      state.sections.restaurantDetails.data.selectedBrand = action.payload
    },
    setRestaurantName: (state, action: PayloadAction<string>) => {
      state.sections.restaurantDetails.data.restaurantName = action.payload
    },
    setStoreId: (state, action: PayloadAction<string>) => {
      state.sections.restaurantDetails.data.storeId = action.payload
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    toggleSection: (state, action: PayloadAction<keyof typeof state.sections>) => {
      state.sections[action.payload].isExpanded = !state.sections[action.payload].isExpanded
    },
    updateMetrics: (state) => {
      const { brandType, selectedBrand, restaurantName, storeId, dcWhPosition, whDcLocationName } =
        state.sections.restaurantDetails.data

      let completedFields = 0
      let totalFields = 0

      // Always count brandType
      if (brandType) completedFields++
      totalFields++

      if (brandType === "Brand") {
        // Brand-specific fields
        if (selectedBrand) completedFields++
        if (restaurantName.trim()) completedFields++
        if (storeId.trim()) completedFields++
        totalFields += 3
        state.sections.restaurantDetails.metrics.remainingMandatoryQuestions = 4 - completedFields
      } else if (brandType === "WH DC") {
        // WH/DC-specific fields
        if (dcWhPosition.trim()) completedFields++
        if (whDcLocationName.trim()) completedFields++
        totalFields += 2
        state.sections.restaurantDetails.metrics.remainingMandatoryQuestions = 3 - completedFields
      } else {
        state.sections.restaurantDetails.metrics.remainingMandatoryQuestions = totalFields - completedFields
      }

      // Update overall metrics
      const totalMandatory = 20
      const totalCompleted = completedFields
      state.processMetrics.remainingMandatoryQs = totalMandatory - totalCompleted
      state.overallCompletion = (totalCompleted / totalMandatory) * 100
    },
    setBrandProductType: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.productType = action.payload
    },
    setSelectedBrandProduct: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.selectedBrandProduct = action.payload
    },
    setKfcProducts: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.kfcProducts = action.payload
    },
    setBrandSupplier: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.supplier = action.payload
    },
    setProductionDate: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.productionDate = action.payload
    },
    setExpirationDate: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.expirationDate = action.payload
    },
    setBatchNo: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.batchNo = action.payload
    },
    setAttachedPhotos: (state, action: PayloadAction<File[]>) => {
      state.sections.brandNames.data.attachedPhotos = action.payload
    },
    setHardeesProducts: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.hardeesProducts = action.payload
    },
    setTgifProducts: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.tgifProducts = action.payload
    },
    setKrispyKremeProducts: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.krispyKremeProducts = action.payload
    },
    setPizzaHutProducts: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.pizzaHutProducts = action.payload
    },
    setAcpProducts: (state, action: PayloadAction<string>) => {
      state.sections.brandNames.data.acpProducts = action.payload
    },
    setDcWhPosition: (state, action: PayloadAction<string>) => {
      state.sections.restaurantDetails.data.dcWhPosition = action.payload
    },
    setWhDcLocationName: (state, action: PayloadAction<string>) => {
      state.sections.restaurantDetails.data.whDcLocationName = action.payload
    },
    setWhDcProductsDetails: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.productsDetails = action.payload
    },
    setWhDcProductNameAsPerLabel: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.productNameAsPerLabel = action.payload
    },
    setWhDcProductCodeOnSystem: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.productCodeOnSystem = action.payload
    },
    setWhDcProductionDate: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.productionDate = action.payload
    },
    setWhDcExpirationDate: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.expirationDate = action.payload
    },
    setWhDcSupplierName: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.supplierName = action.payload
    },
    setWhDcContainerNumber: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.containerNumber = action.payload
    },
    setWhDcArrivalDate: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.arrivalDate = action.payload
    },
    setWhDcArrivalTime: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.arrivalTime = action.payload
    },
    setWhDcTypeOfComplaint: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.typeOfComplaint = action.payload
    },
    setWhDcDescribeIssueInDetails: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.describeIssueInDetails = action.payload
    },
    setWhDcInitialActionTakenByWh: (state, action: PayloadAction<string>) => {
      state.sections.whDc.data.initialActionTakenByWh = action.payload
    },
    setWhDcPosition: (state, action: PayloadAction<string>) => {
      state.sections.restaurantDetails.data.dcWhPosition = action.payload
    },
    toggleQuestionComment: (state, action: PayloadAction<string>) => {
      const questionId = action.payload
      const existingComment = state.questionComments.find((c) => c.questionId === questionId)
      if (existingComment) {
        existingComment.isVisible = !existingComment.isVisible
      } else {
        state.questionComments.push({
          questionId,
          comment: "",
          isVisible: true,
        })
      }
    },
    setQuestionComment: (state, action: PayloadAction<{ questionId: string; comment: string }>) => {
      const { questionId, comment } = action.payload
      const existingComment = state.questionComments.find((c) => c.questionId === questionId)
      if (existingComment) {
        existingComment.comment = comment
      } else {
        state.questionComments.push({
          questionId,
          comment,
          isVisible: true,
        })
      }
    },
    toggleQuestionNA: (state, action: PayloadAction<string>) => {
      const questionId = action.payload
      const existingNA = state.questionNAStates.find((na) => na.questionId === questionId)
      if (existingNA) {
        existingNA.isNA = !existingNA.isNA
      } else {
        state.questionNAStates.push({
          questionId,
          isNA: true,
        })
      }
    },
    setQuestionFiles: (state, action: PayloadAction<{ questionId: string; files: File[] }>) => {
      const { questionId, files } = action.payload
      const existingUpload = state.fileUploads.find((upload) => upload.questionId === questionId)
      if (existingUpload) {
        existingUpload.files = files
      } else {
        state.fileUploads.push({
          questionId,
          files,
        })
      }
    },
    removeQuestionFile: (state, action: PayloadAction<{ questionId: string; fileIndex: number }>) => {
      const { questionId, fileIndex } = action.payload
      const existingUpload = state.fileUploads.find((upload) => upload.questionId === questionId)
      if (existingUpload) {
        existingUpload.files.splice(fileIndex, 1)
      }
    },
    setHasAttemptedSubmit: (state, action: PayloadAction<boolean>) => {
      state.hasAttemptedSubmit = action.payload
    },
  },
})

export const {
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
  setWhDcPosition,
  toggleQuestionComment,
  setQuestionComment,
  toggleQuestionNA,
  setQuestionFiles,
  removeQuestionFile,
  setHasAttemptedSubmit,
} = qaComplianceSlice.actions
export default qaComplianceSlice.reducer
