const renderInputErrors = (errors = [], name) => `
  <div class="input-error text-danger">
  ${errors
    .filter(e => e.param === name)
    .map(e => e.msg)
    .join(", ")}
  </div>
`;

module.exports = {
  renderInputErrors
};
