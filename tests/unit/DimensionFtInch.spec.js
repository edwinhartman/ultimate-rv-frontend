import { mount } from "@vue/test-utils"
import DimensionFtInch from "@/components/rv/DimensionFtInch"

const factory = () => {
  return mount(DimensionFtInch, {
    props: {
      minFt: 5,
      maxFt: 10,
      dimension_prop: {
        length: {
          feet: -1,
          inch: 0,
        },
      },
    },
  })
}
describe("DimensionFtInch.vue", () => {
  it("Feet - range - inside", () => {
    const wrapper = factory()
    const test = wrapper.get('[data-test="feet"]')
    expect(test.text()).toContain("8")
  })
  it("Feet - range - outside", () => {
    const wrapper = factory()
    const test = wrapper.get('[data-test="feet"]')
    expect(test.text()).not.toContain("13")
  })
  it("Inch - range - inside", () => {
    const wrapper = factory()
    const test = wrapper.get('[data-test="inch"]')
    expect(test.text()).toContain("7")
  })
  it("Inch - range - outside", () => {
    const wrapper = factory()
    const test = wrapper.get('[data-test="inch"]')
    expect(test.text()).not.toContain("13")
  })
})
