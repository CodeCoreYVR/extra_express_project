const isValid = (errors, name) => {
  return errors.filter(e => e.param === name).length === 0;
};

const renderInputErrors = (errors = [], name) => `
  <div class="invalid-feedback">
  ${errors
    .filter(e => e.param === name)
    .map(e => e.msg)
    .join(", ")}
  </div>
`

const renderInput = ({
  name,
  value,
  placeholder,
  type = "text",
  errors = []
}) => `
  <div class="form-group">
    <input
      type="${type}"
      class="form-control${isValid(errors, name) ? "" : " is-invalid"}"
      name="${name}"
      placeholder="${placeholder}"
      value="${value || ""}"
    >
      ${renderInputErrors(errors, name)}
  </div>
`;

const renderTextarea = ({
  name,
  value,
  cols = 60,
  rows = 5,
  placeholder,
  errors = []
}) => `
  <div class="form-group">
    <textarea
      class="form-control${isValid(errors, name) ? "" : " is-invalid"}"
      name="${name}"
      cols="${cols}"
      rows="${rows}"
      placeholder="${placeholder}">${value || ""}</textarea>
      ${renderInputErrors(errors, name)}
  </div>
`;

module.exports = {
  renderInput,
  renderInputErrors,
  renderTextarea
};
