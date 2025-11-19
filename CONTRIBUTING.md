# Contributing to SpecKitLab

Thank you for your interest in contributing to SpecKitLab! This document provides guidelines for contributing to the repository.

## Ways to Contribute

1. **Add New Applications**: Create applications in the `apps/` directory
2. **Share Examples**: Add example applications to `examples/`
3. **Improve Documentation**: Enhance guides and tutorials in `docs/`
4. **Report Issues**: Help identify bugs or unclear documentation
5. **Suggest Features**: Propose improvements to the repository structure

## Adding an Application

To add your application to the repository:

1. **Create Your Application**
   ```bash
   mkdir -p apps/YourApp
   ```

2. **Follow the Structure**
   - Use the [Application Template Guide](docs/APPLICATION_TEMPLATE.md)
   - Include a comprehensive README
   - Add proper Metacello baseline

3. **Document Your Work**
   - Explain what the application does
   - Provide installation instructions
   - Include usage examples
   - Document any dependencies

4. **Test Your Application**
   - Load it in a fresh Pharo image
   - Verify all features work
   - Check that documentation is accurate

5. **Submit Your Changes**
   - Commit with clear messages
   - Create a pull request
   - Describe your application in the PR

## Adding an Example

Examples should demonstrate specific Spec-kit features:

1. Keep it focused on one or two concepts
2. Include extensive comments in the code
3. Provide clear learning objectives
4. Make it easy to understand and modify

## Documentation Guidelines

When adding or updating documentation:

- Use clear, simple language
- Include code examples
- Format code blocks properly with syntax highlighting
- Test all code snippets in Pharo
- Add links to related resources

## Code Style

Follow Pharo conventions:

- **Class Names**: PascalCase (e.g., `MyAppPresenter`)
- **Method Names**: camelCase (e.g., `initializePresenters`)
- **Categories**: Use meaningful protocol names
- **Comments**: Write clear, helpful comments
- **Formatting**: Follow standard Pharo formatting

## Commit Messages

Write clear commit messages:

- Start with a verb (Add, Update, Fix, Remove)
- Be specific about what changed
- Reference issues if applicable

Examples:
- `Add counter application example`
- `Update getting started guide with new examples`
- `Fix typo in application template`

## Pull Request Process

1. **Fork the Repository**
2. **Create a Branch** for your changes
3. **Make Your Changes** following these guidelines
4. **Test Everything** in a fresh Pharo image
5. **Submit a Pull Request** with:
   - Clear description of changes
   - Rationale for the changes
   - Screenshots if applicable

## Questions?

If you have questions about contributing:
- Open an issue for discussion
- Check existing documentation in `docs/`
- Review existing applications in `apps/` and `examples/`

## Code of Conduct

Be respectful and constructive in all interactions. We're building a welcoming community for learning and sharing Spec-kit applications.

Thank you for contributing to SpecKitLab!
